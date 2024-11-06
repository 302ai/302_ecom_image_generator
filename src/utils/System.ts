
import ImageManager from "./Image";

export default class SystemManager {

	// Merge properties from source into target recursively
	static mergeData = (target: any, source: any) => {
		for (const key of Object.keys(source)) {
			if (source[key] && typeof source[key] === "object") {
				SystemManager.mergeData((target[key] = target[key] || {}), source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}

	// Check if a string contains Chinese characters
	static containsChinese = (str: string) => /[\u4E00-\u9FA5]/g.test(str);

	// Get current timestamp formatted as "YYYYMMDDHHmmss"
	static getNowformatTime = () => {
		const date = new Date();
		const components = [
			date.getFullYear(),
			date.getMonth() + 1,
			date.getDate(),
			date.getHours(),
			date.getMinutes(),
			date.getSeconds()
		].map(num => String(num).padStart(2, '0'));

		return components.join('');
	}

	// Format a timestamp as "YYYY/MM/DD HH:MM"
	static formatTimestamp = (timestamp: number) => {
		const date = new Date(timestamp);
		const components = [
			date.getFullYear(),
			date.getMonth() + 1,
			date.getDate(),
			date.getHours(),
			date.getMinutes()
		].map(num => String(num).padStart(2, '0'));

		return `${components.slice(0, 3).join('/')} ${components.slice(3).join(':')}`;
	}

	// Copy text to the clipboard
	static copyToClipboard = (text: string) => {
		if (!text) return; // Early return if there's nothing to copy

		if (navigator.clipboard) {
			navigator.clipboard.writeText(text);
		} else {
			const textarea = document.createElement('textarea');
			textarea.value = text;

			// Append, select and copy the text, then remove the textarea
			document.body.appendChild(textarea);
			textarea.style.position = 'fixed';
			textarea.style.clip = 'rect(0 0 0 0)'
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
		}
	}

	// Download image from URL
	static downloadImage = async (url: string, name?: string) => {
		try {
			const file = await ImageManager.imageToFile(url);
			const currentTime = SystemManager.getNowformatTime();
			const metaType = file?.type.split('/')[1] || url.split('.').pop();
			const resultName = name || `result-${currentTime}.${metaType?.split('+')[0]}`;
			const localUrl = URL.createObjectURL(file as File);

			const link = document.createElement('a');
			link.href = localUrl;
			link.download = resultName;
			link.click();
			link.remove();

			setTimeout(() => URL.revokeObjectURL(localUrl), 300);
		} catch (error) {
			console.error('Error downloading image:', error);
		}
	}

	// Download video from URL
	static downloadVideo = async (url: string, name?: string) => {
		try {
			const response = await fetch(url);
			const blob = await response.blob();

			const currentTime = SystemManager.getNowformatTime();
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = name || `result-${currentTime}.mp4`;

			document.body.appendChild(link);
			link.click();
			link.remove();

			URL.revokeObjectURL(link.href);
		} catch (error) {
			console.error('Error downloading video:', error);
		}
	}
}
