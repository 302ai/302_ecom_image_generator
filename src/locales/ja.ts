import { LocaleType } from "./index";

// if you are adding a new translation, please use PartialLocaleType instead of LocaleType

const ja: LocaleType = {
  Symbol: "ja",
  Title: 'AI電子商取引シーン生成 - 302.AI',
  Auth: {
    NeedCode: '共有コードが必要',
    InputCode: 'クリエーターが検証を有効にしています。以下に共有コードを入力してください',
    PlaceHodeer: 'ここに共有コードを入力',
    ToolBin: 'ツールが無効です。詳細については、',
    ToolDel: 'ツールが削除されました。詳細については、',
    Submit: '送信する',
    Remind: '共有コードを記憶する',
    CodeError: '無効なコード！',
    AccountBin: 'アカウントが無効です！',
    AccountDel: 'アカウントが削除されました！',
    NetworkError: 'ネットワークエラー。ページをリフレッシュしてもう一度お試しください！',
  },
  Code: {
    TokenMiss: "このツールは無効または削除されています！", // -10001
    TokenInvalid: "このツールは無効または削除されています！", // -10002
    InternalError: '内部エラー。カスタマーサービスに連絡してください！', // -10003
    AccountOut: 'アカウントが滞納状態です。再度お試しください！', // -10004
    TokenExpired: 'トークンが期限切れです。ページをリフレッシュしてもう一度お試しください！', // -10005
    TotalOut: 'ツールの総利用制限に達しました。管理者に問い合わせて再度お試しください！', // -10006
    TodayOut: 'ツールの日次制限に達しました。管理者に問い合わせて再度お試しください！', // -10007
    HourOut: 'この無料ツールは今時間の上限に達しました', // -10012
    ErrorPrompt: 'ビデオプロンプトの単語が規則に違反しています。再入力してください！', // -10011
  },
  Error: {
    InitError: '初期データエラー！',
    FetchCancel: 'リクエストはキャンセルされました！',
    FetchError: 'リクエストエラー！',
    NetworkError: 'ネットワークエラー。後でもう一度お試しください！',
    TokenMiss: '無効なトークン。確認してもう一度お試しください！',
    AccountError: 'アカウントエラー',
    AccountUnvalid: '現在のアカウントは無効です！',
    InternalError: '内部エラー。カスタマーサービスに連絡してください！',
    BalanceOut: 'アカウントバランスが不足しています。チャージしてください！',
    TokenExpire: '現在のトークンは期限切れです！',
    TotalCostTip: '総利用制限に関する通知',
    TotalCostOut: 'ツールの総利用制限に達しました！',
    TodayCostTip: '日次制限の通知',
    TodayCostOut: 'ツールの日次制限に達しました！',
    FetchNotSupport: 'リクエストエラー、画像が大きすぎるか、フォーマットがサポートされていません！'
  },
  System: {
    Notify: 'システム通知',
    Title: 'システム通知',
    Add: '追加',
    Modify: '編集',
    Delete: '削除',
    Faild: '失敗',
    Success: '成功',
    NotNow: '今はしない',
    Cancel: 'キャンセル',
    Start: '開始',
    Back: '戻る',
    Download: 'ダウンロード',
    Confirm: '確認',
    Error: 'ネットワークエラー',
    Wait: 'システムがビジーです。お待ちください！',
    BalanceOut: 'アカウントバランスが不足しています！',
    Visit: '',
    Register: 'サインアップしてください',
    Create: 'を訪問して自分のツールを作成してください',
    Task: 'タスク',
    ToLarge: '画像が大きすぎます。現在、10MBを超えるファイルの処理はサポートしていません。',
    Nosupport: '無料版ではこの機能はサポートされていません',
  },
  Home: {
    Title: 'AI電子商取引シーン生成',
  },
  About: {
    Title: '情報',
    Name: 'AI電子商取引シーン生成',
    User: 'この写真ツールは302.AIユーザーによって作成されました',
    Create: '',
    Tool: 'これはAIの生成と共有のためのプラットフォームです。302.AIは、ワンクリックで自分のAIロボットを生成および共有することを可能にします。',
    Model: 'このツールは次のモデルを使用します',
    AllCost: 'この写真ツールの総使用制限は',
    TodayCost: 'この写真ツールの日次使用制限は',
    Usage: '使用法:',
    Record: 'このツールのすべての記録はこのマシンに保存され、アップロードされません。ツールを生成したユーザーはあなたの記録を見ることができません。',
    More: '詳細については:',
    Tip: 'AIによって生成されたコンテンツ、参考までに'
  },
  Action: {
    DropIn: 'クリックまたはドラッグ&ドロップしてアップロード',
    Enlarge: '無劣化拡大',
    Enhance: '文字強化',
    Colorize: '白黒をカラー化',
    Break: '生成タスクが進行中です。戻ってもよろしいですか？',
    CreatVideoPrompt: '画像に基づいて生成したい内容を入力してください',
    WaitImage: 'タスクが送信されました、推定待ち時間は約1分です',
    WaitVideo: '5-10分お待ちください',
    CreatImage: '画像を生成する',
    CreatVideo: 'ビデオを生成する',
    DownloadImage: '画像をダウンロード',
    DownloadVideo: 'ビデオをダウンロード',
    RegenerateImage: '再生成画像',
    ReGenerateVideo: '再生成ビデオ',
    DownloadImageTip: '画像生成が完了しました。適時にダウンロードして保存してください！',
    DownloadVideoTip: 'ビデオの生成が完了しました。適時にダウンロードして保存してください！',
    ResultOptions: [
      { label: '画像', value: 'image', disabled: false },
      { label: 'ビデオ', value: 'video', disabled: false },
    ],
  },
  History: {
    Title: '履歴',
    Empty: '申し訳ありませんが、履歴記録がありません！',
    Error: 'データ形式エラー！',
    RollbackSuccess: '記録のロールバックが成功しました！',
    RollbackFaild: '記録のロールバックが失敗しました。データ異常！',
    ClearSuccess: 'すべての履歴記録が削除されました！',
    RecordType: '記録タイプ',
    ClearAll: 'すべての履歴記録をクリア',
    ClearAllSure: 'すべての履歴記録をクリアしてもよろしいですか？',
    Clear: 'クリア',
    NotNow: '今はしない',
    ItemCount: (count: number) => `総計 ${count} 件の履歴記録`,
  },
  Example: {
    title: '例を試す',
    action: 'この例を試す',
    demos: [
      {
        title: '製品シーン',
        desc: 'このツールは、異なる環境シーンに基づいて製品のライティングおよび視覚効果を知的に調整し、どの背景でも製品が最良の状態を示すことを保証します。（このケースのキーワード：月面）',
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
          productText: 'スポーツカー',
          productFile: null,
          //
          sceneType: 'text',
          sceneText: '月面',
          sceneFile: null,
          //
          lightType: 'None',
          //
          result: '',
          video: '',
        }
      },
      {
        title: 'モデルシーン',
        desc: 'このツールは、異なる環境シーンに基づいてモデルのライティングおよび視覚効果を知的に調整し、どの背景でもモデルが最良の状態を示すことを保証します。（このケースのキーワード：ライブコンサート）',
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
          productText: 'モデル',
          productFile: null,
          //
          sceneType: 'text',
          sceneText: 'ライブコンサート',
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
    ProductTitle: '製品',
    ProductInput: '製品名を入力してください',
    ModelInput: 'モデルの特徴を入力してください',
    ProductUpload: '製品実物写真をアップロード',
    ModelUpload: 'モデル実物写真をアップロード',
    SceneTitle: 'シーン',
    SceneInput: 'シーンの説明を入力してください',
    SceneUpload: 'シーン参照画像をアップロード',
    StartGenerate: '生成を開始',
    ProductOptions: [
      { label: '製品', value: 'product', disabled: false },
      { label: 'モデル', value: 'model', disabled: false },
    ],
    SceneOptions: [
      { label: 'テキスト', value: 'text', disabled: false },
      { label: '画像', value: 'image', disabled: false },
    ],
    LightOptions: [
      { label: '自動', value: 'None', disabled: false },
      { label: 'トップライト', value: 'Top Light', disabled: false },
      { label: 'ボトムライト', value: 'Bottom Light', disabled: false },
      { label: '左ライト', value: 'Left Light', disabled: false },
      { label: '右ライト', value: 'Right Light', disabled: false },
    ],
    RatioOptions: [
      { id: -1, label: 'オリジナル', value: -1, disabled: false },
      { id: 0, label: 'カスタマイズ', value: 0, disabled: false },
      { id: 1, label: '1:1', value: 1 / 1, disabled: false },
      { id: 2, label: '4:3', value: 4 / 3, disabled: false },
      { id: 3, label: '3:4', value: 3 / 4, disabled: false },
      { id: 4, label: '16:9', value: 16 / 9, disabled: false },
      { id: 5, label: '9:16', value: 9 / 16, disabled: false },
    ],
    GenerateOptions: [
      { label: 'オリジナルシーンを使用', value: 'light-bg', disabled: false },
      { label: '類似シーンを生成する', value: 'light', disabled: false },
    ],
  },
  Ratio: {
    Title: 'カスタム比率を設定',
    Customize: 'カスタム',
    Width: '幅',
    Height: '高さ',
    WidthTip: '幅を入力してください',
    HeightTip: '高さを入力してください',
    Submit: '送信する',
    Cancel: 'キャンセル',
    Tip: 'アスペクト比制限：1/4〜4/1',
    Error: 'サポートされていない比率です。修正してもう一度お試しください',
  }
};

export default ja;
