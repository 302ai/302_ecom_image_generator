import Image from "next/image";
import { useState, useEffect } from "react";
import { Modal, Card, Button, Popconfirm } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { GetHistorysService, UpdateHistorysService } from "@/libs/api";
import SystemManager from "@/utils/System";
import Locale from "../locales";

export default function HistoryDrawer(props: {
	title: string;
	isOpen: boolean;
	onClose: () => void;
}) {
	const [showList, setShowList] = useState<any[]>([]);

	const cleanHistory = () => {
		setShowList([]);
		UpdateHistorysService([])
	}

	useEffect(() => {
		let historys = GetHistorysService();
		setShowList(historys.reverse());
	}, [props.isOpen]);

	return (
		<>
			<Modal
				title={props.title}
				open={props.isOpen}
				onCancel={props.onClose}
				footer={null}
				width={580}
			>
				<div className="flex w-full mt-2 justify-between items-center">
					<span className="text-sm text-[#bbb]">{Locale.History.ItemCount(showList.length)}</span>
					<div className="flex space-x-2">
						<Popconfirm
							title={Locale.History.ClearAll}
							description={Locale.History.ClearAllSure}
							onConfirm={() => cleanHistory()}
							okText={Locale.History.Clear}
							cancelText={Locale.History.NotNow}
							placement="bottom"
						>
							<Button
								size="middle"
								shape="circle"
								icon={<ClearOutlined />}
							></Button>
						</Popconfirm>
					</div>

				</div>
				<div className="mt-4 flex flex-wrap w-full h-[500px] sm:h-[600px] overflow-y-scroll my-scroll overflow-x-hidden">
					<div className="w-full space-y-4">
						{
							showList.map((it, index) => (
								<div key={index} className="flex w-full relative">
									<Card
										className="w-full bg-[#F7F7F9] relative overflow-hidden"
										actions={[
											<Button
												key="image"
												type="primary"
												disabled={!it.result}
												onClick={() => SystemManager.downloadImage(it.result)}
											>
												{Locale.Action.DownloadImage}
											</Button>,
											<Button
												key="video"
												type="primary"
												disabled={!it.video}
												style={{ background: it.video ? '#407df1' : "#dedede" }}
												onClick={() => SystemManager.downloadVideo(it.video)}
											>
												{Locale.Action.DownloadVideo}
											</Button>
										]}
									>
										<div className="w-full flex items-start justify-start space-x-4 ">
											<div className="rounded-sm overflow-hidden w-[80px]">
												<Image width={80} height={50} style={{ width: '100%', height: 'auto' }} alt={"result image"} src={it.result} className="rounded-sm " />
											</div>
											<div className="flex-1 flex-col justify-normal">
												<p className="font-medium text-md">{it.productText || it.prompt?.split(',')[0] || '原场景图生成'}</p>
												<p className=" text-slate-400 text-xs">
													{it.sceneText || it.prompt?.replace(`${it.prompt.split(',')[0]},`, '')}

												</p>
											</div>
										</div>

										<div className="absolute right-2 top-2 text-slate-400">
											{SystemManager.formatTimestamp(it.id)}
										</div>

									</Card>
								</div>
							))
						}
					</div>
				</div>
			</Modal>
		</>
	);
}
