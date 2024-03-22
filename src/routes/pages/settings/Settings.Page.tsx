import { Fragment } from 'react';

import { Combine, CornerDownLeft, CornerUpLeft, Laptop2, Palette, UserSquare2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'User',
      options: [
        {
          title: 'Profile',
          icon: <UserSquare2 size={16} />,
        },
      ],
    },

    {
      title: 'App',
      options: [
        {
          title: 'General',
          icon: <Laptop2 size={16} />,
        },

        {
          title: 'Appearance',
          icon: <Palette size={16} />,
        },
      ],
    },

    {
      title: 'Calender',
      options: [
        {
          title: 'Connected Accounts',
          icon: <Combine size={16} />,
        },
      ],
    },
  ];

  return (
    <div className="settings-page page-container">
      <div className="left-navigation">
        <div className="back-icon" onClick={() => navigate('/today')}>
          <CornerUpLeft size={16} />
        </div>

        <div className="categories">
          {sections.map((section, index) => {
            return (
              <Fragment key={index}>
                <div className="category-section">
                  <p className="section-header favorit-font medium-font">{section.title}</p>
                  <div className="sub-categories">
                    {section?.options?.map((category, index) => {
                      return (
                        <div className="category" key={index}>
                          <div className="category-icon">{category.icon}</div>
                          <p className="category-name">{category?.title}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {sections.length - 1 !== index && <div className="section-divider"></div>}
              </Fragment>
            );
          })}
        </div>
      </div>
      <div className="right-navigation">Content goes here </div>
    </div>
  );
};

export default SettingsPage;
