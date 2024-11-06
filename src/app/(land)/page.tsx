"use client";
import 'whatwg-fetch'
import { useState, useEffect } from "react";
import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs';

import Locale from "@/locales";
import { AppContext } from '@/store';
import { GLOBAL_INTERNATIONAL_DATA } from "@/constants";
import { UpdateLocalAuthDataService } from "@/libs/api";

import Header from "@/components/Header";
import Footer from '@/components/Footer';
import PageLoading from "../../components/PageLoading";
import LangMenu from "@/components/LangMenu";
import ImageUpscaler from "@/components/ImageUpscaler";
import Landing from "@/components/Landing";

import { generateImage, generateVideo } from "./query";
import "./page.css";


export default function EcomPage() {
	const [isLoading, setIsLoading] = useState(true)
	const [globalState,] = useState(GLOBAL_INTERNATIONAL_DATA);
	const [initData,] = useState<any>(null)
	const [file, setFile] = useState<File | undefined>()
	const [actionData, setActionData] = useState({
		generateTimes: 0,
		generateType: 'light',
		maskFile: null,
		prompt: '',
		productType: 'product',
		productText: '',
		productFile: null,
		sceneType: 'text',
		sceneText: '',
		sceneFile: null,
		lightType: 'None',
		result: '',
		video: '',
		ratio: 1,
	});

	// Set API-Key
	useEffect(() => {
		document.title = Locale.Title;
		const apiKey = process.env.NEXT_PUBLIC_API_KEY
		if (apiKey) {
			UpdateLocalAuthDataService({ key: apiKey })
		} else {
			console.error("Miss 302 API-Key!")
		}
		setIsLoading(false)
	}, [])

	if (isLoading) return <PageLoading />

	return (
		<AppContext.Provider value={globalState}>
			<StyleProvider layer hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
				<div className="flex w-full flex-col">
					<Header />
					<div id="tanslator-container" className="flex w-full justify-center sm:mt-6">
						<div className="w-full flex flex-col  p-4 sm:p-6 justify-center max-w-[1280px] relative">
							<div className="fixed right-4 top-4 flex space-x-2 items-center">
								<LangMenu />
							</div>
							<div className="w-full">
								<div className="flex w-full flex-col items-center">
									{file ? (
										<ImageUpscaler file={file} setFile={setFile} action={actionData} setAction={setActionData} generateImage={generateImage} generateVideo={generateVideo} />
									) : (
										<Landing file={file} setFile={setFile} data={initData} action={actionData} setAction={setActionData} />
									)}
								</div>
							</div>
						</div>
					</div >
					<Footer />
				</div>
			</StyleProvider>
		</AppContext.Provider>
	);
}
