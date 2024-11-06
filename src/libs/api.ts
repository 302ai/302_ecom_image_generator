import LocalStorageManager from "../utils/Storage";
import { TAuthData } from "../types";
import {
  TRANSLATE_PROMPT,
  LOCAL_CONFIG_KEY,
  LOCAL_TASK_KEY,
  LOCAL_HISTORYS_KEY,
  LOCAL_AUTH_KEY,
  LOCAL_ACTION_KEY,
  DEFAULT_AUTH_DATA,
} from "@/constants";
import 'whatwg-fetch'

// Auth
export const GetLocalAuthDataService = async () => {
  const data = LocalStorageManager.getItem(LOCAL_AUTH_KEY) || DEFAULT_AUTH_DATA
  return data
}

export const UpdateLocalAuthDataService = async (value: TAuthData) => {
  LocalStorageManager.setItem(LOCAL_AUTH_KEY, value);
};

// Config
export const GetConfigService = () => {
  const list = LocalStorageManager.getItem(LOCAL_CONFIG_KEY) || {};
  return list;
};

export const UpdateConfigService = (value: any) => {
  LocalStorageManager.setItem(LOCAL_CONFIG_KEY, value);
};

// Task
export const GetTaskService = () => {
  const data = LocalStorageManager.getItem(LOCAL_TASK_KEY) || {};
  return data;
};

export const UpdateTaskService = (value: any) => {
  LocalStorageManager.setItem(LOCAL_TASK_KEY, value);
};

// Action
export const GetActionService = () => {
  const data = LocalStorageManager.getItem(LOCAL_ACTION_KEY) || {};
  return data;
};

export const UpdateActionService = (value: any) => {
  LocalStorageManager.setItem(LOCAL_ACTION_KEY, value);
};

// History
export const GetHistorysService = () => {
  const list = LocalStorageManager.getItem(LOCAL_HISTORYS_KEY) || [];
  return list;
};

export const UpdateHistorysService = (value: any[]) => {
  LocalStorageManager.setItem(LOCAL_HISTORYS_KEY, value);
};

// Upload Image
export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prefix', 'restoration');

    const response = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_API_URL}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const { body } = response;
    if (!body) {
      return;
    }
    const data = await response.json();
    return data.data.url;
  } catch (error) {
    console.error('Upload image error:', error);
  }
}

// AI Translate
export const aiTranslate = (str: string) => {
  const fetUrl = `${process.env.NEXT_PUBLIC_FETCH_API_URL}/v1/chat/completions`
  return new Promise<any>(async (resolve, reject) => {
    try {
      const authData = await GetLocalAuthDataService();
      const myHeaders = new Headers()
      myHeaders.append('Accept', 'image/*')
      myHeaders.append('Authorization', `Bearer ${authData.key}`)
      myHeaders.append('Content-Type', 'application/json')

      const data = {
        messages:
          [
            {
              role: 'system',
              content: TRANSLATE_PROMPT,
            },
            {
              role: 'user',
              content: str,
            }],
        stream: false,
        model: 'gpt-3.5-turbo-16k',
      }

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(data),
      }

      fetch(fetUrl, requestOptions)
        .then(response => response.json())
        .then((result) => {
          resolve(result.choices[0].message.content)
        })
        .catch(error => reject(error))
    }
    catch (error) {
      reject(error)
    }
  })
}

// AI Image to Text
export const aiImageToText = (url: string, prompt: string) => {
  const fetUrl = `${process.env.NEXT_PUBLIC_FETCH_API_URL}/v1/chat/completions`
  return new Promise<any>(async (resolve, reject) => {
    try {
      const authData = await GetLocalAuthDataService();
      const myHeaders = new Headers()
      myHeaders.append('Accept', 'image/*')
      myHeaders.append('Authorization', `Bearer ${authData.key}`)
      myHeaders.append('Content-Type', 'application/json')

      const data = {
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: url
                }
              }
            ]
          }
        ],
        stream: false,
        model: "gpt-4o",
      }

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(data),
      }

      fetch(fetUrl, requestOptions)
        .then(response => response.json())
        .then((result) => {
          resolve(result.choices[0].message.content)
        })
        .catch(error => reject(error))
    }
    catch (error) {
      reject(error)
    }
  })
}