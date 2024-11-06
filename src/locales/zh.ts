
// if you are adding a new translation, please use PartialLocaleType instead of LocaleType

const zh = {
  Symbol: "zh",
  Title: 'AI电商场景图生成 - 302.AI',
  Auth: {
    NeedCode: '需要分享码',
    InputCode: '创建者开启了验证，请在下方填入分享码',
    PlaceHodeer: '请输入分享码数',
    ToolBin: '工具已禁用, 更多信息请访问',
    ToolDel: '工具已删除, 更多信息请访问',
    Submit: '确认',
    Remind: '记住分享码',
    CodeError: '验证码错误！',
    AccountBin: '账号已被禁用!',
    AccountDel: '账号已被注销！',
    NetworkError: '网络错误，请刷新页面后重试！',
  },
  Code: {
    TokenMiss: '该工具已禁用/删除！', // -10001
    TokenInvalid: '该工具已禁用/删除！', // -10002
    InternalError: '内部错误，请联系客服！', // -10003
    AccountOut: '账号欠费，请充值后重试!', // -10004
    TokenExpired: '令牌过期，请刷新页面后重试！', // -10005
    TotalOut: '工具总额度已用完，请联系管理员充值！', // -10006
    TodayOut: '工具当日额度已用完，请联系管理员充值！', // -10007
    HourOut: '该免费工具在本小时的额度已达上限', // -10012
    ErrorPrompt: '视频提示词违规，请重新输入！', // -10011
  },
  Error: {
    InitError: '初始化数据错误!',
    FetchCancel: '请求取消！',
    FetchError: '请求错误！',
    NetworkError: '生成错误，请稍后重试！',
    TokenMiss: '令牌无效，请验证后重试!',
    AccountError: '账号异常',
    AccountUnvalid: '当前账号已经失效!',
    InternalError: '内部错误，请联系客服!',
    BalanceOut: '账号余额不足，请充值！',
    TokenExpire: '当前令牌已过期！',
    TotalCostTip: '总额度提醒',
    TotalCostOut: '工具总额度已达到上限！',
    TodayCostTip: '当日额度提醒',
    TodayCostOut: '工具当日额度已达到上限！',
    FetchNotSupport: '请求错误，图片过大或格式不支持！',
  },
  System: {
    Notify: '系统通知',
    Title: '系统通知',
    Add: '添加',
    Modify: '修改',
    Delete: '删除',
    Faild: '失败',
    Success: '成功',
    NotNow: '暂不',
    Cancel: '取消',
    Start: '开始',
    Back: '返回',
    Download: '下载',
    Confirm: '确定',
    Error: '网络错误',
    Wait: '系统繁忙，请稍等！',
    BalanceOut: '账户额度不足！',
    Visit: '请访问',
    Register: '请注册',
    Create: '生成属于自己的工具',
    Task: '任务',
    ToLarge: '图片过大, 暂不支持大小超过10M的图片处理',
    Nosupport: '免费版不支持此功能',
  },
  Home: {
    Title: 'AI电商场景图生成',
  },
  About: {
    Title: '关于',
    Name: 'AI电商场景图生成',
    User: '本图片工具由302.AI用户',
    Create: '创建',
    Tool: '302.AI是一个AI生成和分享的平台，可以一键生成自己的AI工具',
    Model: '本图片工具使用的模型为',
    AllCost: '本图片工具的总限额为',
    TodayCost: '本图片工具的单日限额为',
    Usage: '已经使用',
    Record: '本图片工具的记录均保存在本机，不会被上传，生成此工具的用户无法看到你的记录',
    More: '更多信息请访问：',
    Tip: '内容由AI生成，仅供参考'
  },
  Action: {
    DropIn: '点击或拖拽上传',
    Enlarge: '无损放大',
    Enhance: '人物增强',
    Colorize: '黑白上色',
    Break: '生成任务正在进行中，确认要返回吗？',
    CreatVideoPrompt: '请根据图片，输入您想要生成的视频内容',
    WaitImage: '任务已提交，预计等待1分钟左右',
    WaitVideo: '请等待5-10分钟',
    CreatImage: '生成图片',
    CreatVideo: '生成视频',
    DownloadImage: '下载图片',
    DownloadVideo: '下载视频',
    RegenerateImage: '重新生成图片',
    ReGenerateVideo: '重新生成视频',
    DownloadImageTip: '图片修复完成，请及时下载保存！',
    DownloadVideoTip: '视频生成完成，请及时下载保存！',
    ResultOptions: [
      { label: '图片', value: 'image', disabled: false },
      { label: '视频', value: 'video', disabled: false },
    ],
  },
  History: {
    Title: '历史记录',
    Empty: '抱歉, 暂无历史记录!',
    Error: '数据格式错误！',
    RollbackSuccess: '记录回滚成功!',
    RollbackFaild: '记录回滚失败，数据异常!',
    ClearSuccess: '历史记录已全部删除！',
    RecordType: '记录类型',
    ClearAll: '清空历史记录',
    ClearAllSure: '确定清空所有历史记录吗？',
    Clear: '清空',
    NotNow: '暂不',
    ItemCount: (count: number) => `共${count}条历史记录`,

  },
  Example: {
    title: 'TRY AN EXAMPLE',
    action: '试一试',
    demos: [
      {
        title: '产品场景',
        desc: '这款工具能够智能地根据不同的场景环境，自动调整产品的光线和视觉效果，确保产品在任何背景下都能展现出最佳状态。（本案例关键词：月球表面）',
        before: '/images/product-before.jpeg',
        after: '/images/product-after.jpeg',
        action: {
          generateTimes: 0,
          generateType: 'light',
          // 
          maskFile: null,
          prompt: '',
          // 
          productType: 'product',
          productText: '跑车',
          productFile: null,
          //
          sceneType: 'text',
          sceneText: '月球表面',
          sceneFile: null,
          //
          lightType: 'None',
          //
          result: '',
          video: '',
        }
      },
      {
        title: '模特场景',
        desc: '这款工具能够智能地根据不同的场景环境，自动调整模特的光线和视觉效果，确保模特在任何背景下都能展现出最佳状态。（本案例关键词：演唱会现场）',
        before: '/images/model-before.jpeg',
        after: '/images/model-after.jpeg',
        action: {
          generateTimes: 0,
          generateType: 'light',
          // 
          maskFile: null,
          prompt: '',
          // 
          productType: 'model',
          productText: '模特',
          productFile: null,
          //
          sceneType: 'text',
          sceneText: '演唱会现场',
          sceneFile: null,
          //
          lightType: 'None',
          //
          result: '',
          video: '',
        }
      },
    ]
  },
  Landing: {
    ProductTitle: '商品图片',
    ProductInput: '请输入产品名称, 例如空气净化器',
    ModelInput: '请输入模特特征，例如黑人',
    ProductUpload: '上传商品实拍图',
    ModelUpload: '上传模特实拍图',
    SceneTitle: '场景要求',
    SceneInput: '请输入场景描述',
    SceneUpload: '上传场景图参考',
    StartGenerate: '开始生成',
    ProductOptions: [
      { label: '产品图', value: 'product', disabled: false },
      { label: '模特图', value: 'model', disabled: false },
    ],
    SceneOptions: [
      { label: '文字', value: 'text', disabled: false },
      { label: '图片', value: 'image', disabled: false },
    ],
    LightOptions: [
      { label: '自动', value: 'None', disabled: false },
      { label: '顶部灯光', value: 'Top Light', disabled: false },
      { label: '底部灯光', value: 'Bottom Light', disabled: false },
      { label: '左侧灯光', value: 'Left Light', disabled: false },
      { label: '右侧灯光', value: 'Right Light', disabled: false },
    ],
    RatioOptions: [
      { id: -1, label: '原图', value: -1, disabled: false },
      { id: 0, label: '自定', value: 0, disabled: false },
      { id: 1, label: '1:1', value: 1 / 1, disabled: false },
      { id: 2, label: '4:3', value: 4 / 3, disabled: false },
      { id: 3, label: '3:4', value: 3 / 4, disabled: false },
      { id: 4, label: '16:9', value: 16 / 9, disabled: false },
      { id: 5, label: '9:16', value: 9 / 16, disabled: false },
    ],
    GenerateOptions: [
      { label: '使用原场景', value: 'light-bg', disabled: false },
      { label: '生成相似场景', value: 'light', disabled: false },
    ],

  },
  Ratio: {
    Title: '设置自定义比例',
    Customize: '自定义',
    Width: '宽度',
    Height: '高度',
    WidthTip: '请输入宽度',
    HeightTip: '请输入高度',
    Submit: '提交',
    Cancel: '取消',
    Tip: '宽高比例限制1/4 ~ 4/1',
    Error: '比例不支持, 请修改后重试',
  }
};

type DeepPartial<T> = T extends object
  ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  }
  : T;

export type LocaleType = typeof zh;
export type PartialLocaleType = DeepPartial<typeof zh>;

export default zh;
