import 'whatwg-fetch'
import { GetLocalAuthDataService, GetTaskService, UpdateTaskService } from "@/libs/api"
import { uploadImage, aiImageToText, aiTranslate } from '@/libs/api'
import SystemManager from "@/utils/System"
import ImageManager from "@/utils/Image"
import { SCENE_PROMPT, PRODUCT_PROMPT, VIDEO_PROMPT } from '@/constants'

type Result = {
  imageSrc: string
  maskFile: File
  prompt: string
}

interface Props {
  file: File,
  action: any,
}

// Remath Image Size
function resizeImage(inputWidth: number, inputHeight: number) {
  let isSwitch = false
  let width = 0
  let height = 0
  // 取整并记录是否对调
  if (inputWidth > inputHeight) {
    width = Math.floor(inputWidth)
    height = Math.floor(inputHeight)
  } else {
    isSwitch = true
    width = Math.floor(inputHeight)
    height = Math.floor(inputWidth)
  }
  // 原始宽高比例
  const ratio = width / height;

  // 定义取得宽高的数组
  const sizes = [256, 320, 384, 448, 512, 576, 640, 704, 768, 832, 896, 960, 1024];

  // 初始化最接近原始宽度和高度的新宽度和高度为第一个数值
  let newWidth = sizes[0];
  let newHeight = sizes[0];

  // 找到最接近原始宽度的新宽度

  if (width > sizes[sizes.length - 1]) {
    newWidth = sizes[sizes.length - 1]
  } else {
    for (let i = 0; i < sizes.length; i++) {
      if (sizes[i] >= width) {
        newWidth = sizes[i];
        break;
      }
    }
  }

  // 根据比例计算新高度
  newHeight = Math.floor(newWidth / ratio);

  // 找到最接近原始高度的新高度
  for (let i = 0; i < sizes.length; i++) {
    if (sizes[i] >= newHeight) {
      newHeight = sizes[i];
      break;
    }
  }

  // 根据比例计算新宽度
  // newWidth = Math.floor(newHeight * ratio);
  if (isSwitch) {
    return { width: newHeight, height: newWidth };
  }
  // 返回新的宽高
  return { width: newWidth, height: newHeight };
}


// Fetch Task Result
async function fetchTask(id: string) {
  const authData = await GetLocalAuthDataService();
  return new Promise((resolve, reject) => {
    let counter = 0;
    const maxAttempts = 30;

    const fetchApi = (id: string) => {
      fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/302/task/${id}/fetch
      `, {
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            reject(data.error)
            return
          }
          if (data.status === 'succeeded') {
            resolve(data);
          } else if (data.status === 'failed') {
            reject('Task failed')
          } else {
            if (counter < maxAttempts) {
              counter++;
              const task = GetTaskService()
              if (task.id) {
                setTimeout(() => fetchApi(id), 5000); // 每隔5秒轮询一次
              }
            } else {
              reject("Max attempts reached");
            }
          }
        })
        .catch(error => {
          reject(error);
        });
    };
    fetchApi(id);
  });
}

// Create Image ///////////////////
export async function generateImage(file: File, action: any): Promise<Result> {
  return new Promise(async (resolve, reject) => {
    let res = null
    let result = { imageSrc: '', maskFile: action.maskFile, prompt: '', }
    let newFile = action.maskFile
    try {
      if (!newFile) {
        newFile = await removeBackground(action.productFile)
        newFile = await ImageManager.pngFileToJpgFile(newFile) as File
        result.maskFile = newFile
      }
      if (action.generateType === 'light') {
        res = await lightImage(newFile, action)
      } else {
        res = await lightBg(newFile, action)
      }
      if (res.output.startsWith('[')) {
        result.prompt = res.prompt
        result.imageSrc = JSON.parse(res.output)[0]
      } else {
        result.prompt = res.prompt
        result.imageSrc = res.output
      }
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

// Romove BG
export async function removeBackground(file: File): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let result = null
      const authData = await GetLocalAuthDataService();
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/sd/v2beta/stable-image/edit/remove-background`, {
        method: 'POST',
        body: formData,
        headers: {
          "Accept": "image/*",
          "Authorization": `Bearer ${authData.key}`,
        },
      })
      if (!res.ok) {
        throw await res.json()
      }
      const blob = await res.blob();
      const newFile = new File([blob], 'file.jpg', { type: blob.type });
      resolve(newFile)
    } catch (error) {
      reject(error)
    }
  })
}

// Relight Image
export async function lightImage(file: File, action: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let result = null
      let prompt = action.prompt
      const authData = await GetLocalAuthDataService();
      const img: any = await ImageManager.readImageSize(file)
      if (!prompt) {
        let productText = action.productText
        if (!productText) {
          const url = await uploadImage(file)
          productText = await aiImageToText(url, PRODUCT_PROMPT)
          if (productText.endsWith('.')) {
            productText = productText.slice(0, -1)
          }
        }
        let sceneText = action.sceneText
        if (action.sceneType === 'image') {
          const url = await uploadImage(action.sceneFile)
          sceneText = await aiImageToText(url, SCENE_PROMPT)
        }
        prompt = `${productText}, ${sceneText}`
        if (SystemManager.containsChinese(prompt)) {
          prompt = await aiTranslate(prompt)
        }

      }
      const { width, height } = resizeImage(img.width, img.height)
      const formData = new FormData();
      formData.append('subject_image', file);
      formData.append('prompt', prompt);
      formData.append('width', width + '');
      formData.append('height', height + '');
      formData.append('light_source', action.lightType);

      const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/302/submit/relight`, {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      })
      if (!res.ok) {
        throw await res.json()
      }

      result = await res.json()
      UpdateTaskService(result)
      if (result.output) {
        result.prompt = prompt
        resolve(result)
        return
      }
      result = await fetchTask(result.id) as any
      result.prompt = prompt
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

// Relight BG
export async function lightBg(file: File, action: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let result = null
      const authData = await GetLocalAuthDataService();
      const img: any = await ImageManager.readImageSize(action.sceneFile)
      const { width, height } = resizeImage(img.width, img.height)

      const formData = new FormData();
      formData.append('subject_image', file);
      formData.append('background_image', action.sceneFile);
      formData.append('prompt', "");
      formData.append('width', width + '');
      formData.append('height', height + '');

      const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/302/submit/relight-background`, {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      })
      if (!res.ok) {
        throw await res.json()
      }

      result = await res.json()
      UpdateTaskService(result)
      if (result.output) {
        result.prompt = prompt
        resolve(result)
        return
      }
      result = await fetchTask(result.id) as any
      result.prompt = prompt
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

// Upscale Image
export async function upscaleImage(file: File, action: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      if (action.scale === 0) {
        const url = await uploadImage(file)
        resolve({ output: url })
        return
      }
      const authData = await GetLocalAuthDataService();
      const img: any = await ImageManager.readImageSize(file)
      const width = img.width * action.scale + ''
      const formData = new FormData();
      formData.append('image', file);
      formData.append('width', width);

      const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/sd/v1/generation/esrgan-v1-x2plus/image-to-image/upscale`, {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      })
      if (!res.ok) {
        throw await res.json()
      }

      const data = await res.json()
      if (data.artifacts) {
        const base64 = 'data:image/png;base64,' + data.artifacts[0].base64
        const file = await ImageManager.imageToFile(base64)
        const url = await uploadImage(file as File)
        resolve({ output: url })
      }
    } catch (error) {
      reject(error)
    }
  })
}

// Upacale Face
export async function upscaleFace(file: File, action: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let result = null
      const authData = await GetLocalAuthDataService();
      const formData = new FormData();
      formData.append('input', file);
      formData.append('image', file);
      if (action.scale > 0) {
        formData.append('upscale', action.scale + '');
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/302/submit/face-upscale`, {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      })
      if (!res.ok) {
        throw await res.json()
      }

      result = await res.json()
      UpdateTaskService(result)
      if (result.output) {
        resolve(result)
        return
      }
      result = await fetchTask(result.id)
      resolve(result)

    } catch (error) {
      reject(error)
    }
  })
}

// Colorize Image
export async function colorizeImage(url: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let result = null
      const authData = await GetLocalAuthDataService();
      const formData = new FormData();
      formData.append('image', url);

      const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/302/submit/colorize`, {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      })
      if (!res.ok) {
        throw await res.json()
      }

      result = await res.json()
      UpdateTaskService(result)
      if (result.output) {
        resolve(result)
        return
      }
      result = await fetchTask(result.id)
      resolve(result)

    } catch (error) {
      reject(error)
    }
  })

}


// Create Video ////////////////////
export async function generateVideo(src: string, payload: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let res = null
    let result = { video: '', ratio: payload.ratio }
    let local = src

    try {
      // Luma
      if (payload.model === 'luma') {
        if (payload.canvas) {
          local = payload.canvas.toDataURL()
        }
        const file = await ImageManager.imageToFile(local) as File
        const url = await uploadImage(file)
        let prompt = payload.prompt
        if (!prompt) {
          prompt = await aiImageToText(url, VIDEO_PROMPT)
        }
        if (SystemManager.containsChinese(prompt)) {
          prompt = await aiTranslate(prompt)
        }
        res = await getLumaVideo(url, prompt)
      }

      // Kling
      if (payload.model === 'kling') {
        if (payload.canvas) {
          local = payload.canvas.toDataURL()
        }
        const file = await ImageManager.imageToFile(local) as File
        const ratio = payload.label
        let prompt = payload.prompt
        res = await getKlingVideo(file, ratio, prompt)
      }

      // Runway
      if (payload.model === 'runway') {
        if (payload.canvas) {
          const size = payload.label.split(":")
          const newCanvas = await ImageManager.resetSizeCanvas(payload.canvas, { width: Number(size[0]), height: Number(size[1]) }) as any
          local = newCanvas.toDataURL()
        }
        const file = await ImageManager.imageToFile(local) as File
        let prompt = payload.prompt
        if (prompt && SystemManager.containsChinese(prompt)) {
          prompt = await aiTranslate(prompt)
        }
        res = await getRunwayVideo(file, prompt)
      }

      result.video = res.output

      if (result.video) {
        resolve(result)
      } else {
        reject('Create image error!')
      }
    } catch (error) {
      reject(error)
    }
  })
}

// Video: Luma
export async function getLumaVideo(url: string, prompt: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let result: any = {}
      const authData = await GetLocalAuthDataService();
      const formData = new FormData();
      formData.append('user_prompt', prompt);
      formData.append('image_url', url);

      const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/luma/submit`, {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      })
      if (!res.ok) {
        throw await res.json()
      }

      result = await res.json()
      UpdateTaskService(result)
      if (result.video) {
        resolve({ output: result.video })
        return
      }
      result = await fetchLumaTask(result.id)
      resolve({ output: result.video })

    } catch (error) {
      reject(error)
    }
  })

}

// Fetch: Luma
async function fetchLumaTask(id: string) {
  const authData = await GetLocalAuthDataService();
  return new Promise((resolve, reject) => {
    let counter = 0;
    const maxAttempts = 120;

    const fetchApi = (id: string) => {
      fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/luma/task/${id}/fetch
      `, {
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            reject(data.error)
            return
          }
          if (data.state === 'completed') {
            resolve(data);
          } else if (data.state === 'failed') {
            reject('Task failed')
          } else {
            if (counter < maxAttempts) {
              counter++;
              const task = GetTaskService()
              if (task.id) {
                setTimeout(() => fetchApi(id), 10000);
              }
            } else {
              reject("Max attempts reached");
            }
          }
        })
        .catch(error => {
          reject(error);
        });
    };
    fetchApi(id);
  });
}

// Video：Kling
export async function getKlingVideo(file: File, ratio: string, prompt: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let result: any = {}
      const authData = await GetLocalAuthDataService();

      const formdata = new FormData();
      formdata.append("input_image", file);
      formdata.append("prompt", prompt);
      formdata.append("negative_prompt", "");
      formdata.append("cfg", "0.5");
      formdata.append("aspect_ratio", ratio);
      formdata.append("camera_type", "zoom");
      formdata.append("camera_value", "-5");


      const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/klingai/m2v_img2video`, {
        method: 'POST',
        body: formdata,
        headers: {
          // "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${authData.key}`,
        },
      })
      if (!res.ok) {
        throw await res.json()
      }

      result = await res.json()
      // save task
      UpdateTaskService(result.data.task)
      const video = result.data.works[0]?.resource.resource
      if (video) {
        resolve({ output: video })
        return
      }
      result = await fetchKlingTask(result.data.task.id)
      resolve(result)

    } catch (error) {
      reject(error)
    }
  })

}

// Fetch: Kling
async function fetchKlingTask(id: string) {
  const authData = await GetLocalAuthDataService();
  return new Promise((resolve, reject) => {
    let counter = 0;
    const maxAttempts = 120;

    const fetchApi = (id: string) => {
      fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/klingai/task/${id}/fetch
      `, {
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          const video = data.data.works[0]?.resource.resource
          if (video) {
            resolve({ output: video });
          } else {
            if (counter < maxAttempts) {
              counter++;
              const task = GetTaskService()
              if (task.id) {
                setTimeout(() => fetchApi(id), 10000);
              }
            } else {
              reject("Max attempts reached");
            }
          }
        })
        .catch(error => {
          reject(error);
        });
    };
    fetchApi(id);
  });
}

// Video：Runway
export async function getRunwayVideo(file: File, prompt: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let result: any = {}
      const authData = await GetLocalAuthDataService();

      const formdata = new FormData();
      formdata.append("image_url", file);
      formdata.append("image_end_url", "");
      formdata.append("text_prompt", prompt);
      formdata.append("seconds", "5");
      formdata.append("seed", "");


      const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/runway_turbo/submit`, {
        method: 'POST',
        body: formdata,
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      })
      if (!res.ok) {
        throw await res.json()
      }

      result = await res.json()
      UpdateTaskService(result.task)
      const video = result.task.artifacts[0]?.url
      if (video) {
        resolve({ output: video })
        return
      }
      result = await fetchRunwayTask(result.task.id)
      resolve(result)

    } catch (error) {
      reject(error)
    }
  })

}

// Fetch: Runway
async function fetchRunwayTask(id: string) {
  const authData = await GetLocalAuthDataService();
  return new Promise((resolve, reject) => {
    let counter = 0;
    const maxAttempts = 120;

    const fetchApi = (id: string) => {
      fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/runway/task/${id}/fetch
      `, {
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          const video = data.task.artifacts[0]?.url
          if (video) {
            resolve({ output: video });
          } else {
            if (counter < maxAttempts) {
              counter++;
              const task = GetTaskService()
              if (task.id) {
                setTimeout(() => fetchApi(id), 10000);
              }
            } else {
              reject("Max attempts reached");
            }
          }
        })
        .catch(error => {
          reject(error);
        });
    };
    fetchApi(id);
  });
}