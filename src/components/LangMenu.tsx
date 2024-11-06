import React from 'react';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { TranslationOutlined } from '@ant-design/icons';
import Locale, { changeLang } from "@/locales"

const onClick: MenuProps['onClick'] = ({ key }) => {
  changeLang(key)
};

const items: MenuProps['items'] = [
  {
    key: 'zh',
    label: '中文',
  },
  {
    key: 'en',
    label: 'English',
  },
  {
    key: 'ja',
    label: '日本語',
  },
];

const LangMenu = () => (
  <Dropdown
    menu={{
      items,
      onClick,
      selectable: true,
      defaultSelectedKeys: [Locale.Symbol],
    }}
  >
    <div className='pt-[2px] '>
      <TranslationOutlined className="my-button my-icon" />
    </div>
  </Dropdown>
);

export default LangMenu;