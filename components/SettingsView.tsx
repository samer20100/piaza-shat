import React, { useState } from 'react';
import { Settings, TRANSLATIONS } from '../types';

interface SettingsViewProps {
  settings: Settings;
  onUpdateSettings: (newSettings: Settings) => void;
  onClose: () => void;
}

type SettingsTab = 'General' | 'Account' | 'Privacy' | 'Billing' | 'Capabilities' | 'Connectors' | 'Claude Code';

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings, onClose }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('General');
  const t = TRANSLATIONS[settings.language];
  const isRtl = settings.language === 'ar';

  const handleChange = (field: keyof Settings, value: any) => {
    onUpdateSettings({ ...settings, [field]: value });
  };

  const tabs: SettingsTab[] = [
    'General', 'Account', 'Privacy', 'Billing', 'Capabilities', 'Connectors', 'Claude Code'
  ];

  const getTabName = (tab: SettingsTab) => {
    switch (tab) {
      case 'General': return t.general;
      case 'Account': return t.account;
      case 'Privacy': return t.privacy;
      case 'Billing': return t.billing;
      case 'Capabilities': return t.capabilities;
      case 'Connectors': return t.connectors;
      case 'Claude Code': return t.biazaCode;
      default: return tab;
    }
  };

  return (
    <div className={`flex-1 flex h-full bg-white dark:bg-claude-bg text-zinc-900 dark:text-[#ececec] overflow-hidden ${isRtl ? 'flex-row-reverse' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Settings Sidebar */}
      <div className={`w-64 flex-shrink-0 border-r border-gray-200 dark:border-[#27272a] p-4 flex flex-col gap-1 overflow-y-auto ${isRtl ? 'border-l border-r-0' : ''}`}>
        <h2 className="text-xl font-serif font-medium px-3 mb-4 mt-2">{t.settings}</h2>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isRtl ? 'text-right' : 'text-left'} ${
              activeTab === tab 
                ? 'bg-gray-100 dark:bg-claude-panel text-black dark:text-white' 
                : 'text-zinc-600 dark:text-claude-muted hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-claude-panel'
            }`}
          >
            {getTabName(tab)}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-10 pb-24">
          
          <div className="flex items-center justify-between mb-8">
             <h1 className="text-2xl font-medium">{getTabName(activeTab)}</h1>
             <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-claude-panel rounded-full text-zinc-500 dark:text-claude-muted hover:text-black dark:hover:text-white transition-colors">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
             </button>
          </div>

          {activeTab === 'General' && (
            <div className="space-y-12">
              
              {/* Appearance / Theme */}
              <section className="space-y-6">
                 <h3 className="text-lg font-medium border-b border-gray-200 dark:border-[#27272a] pb-2">{t.appearance}</h3>
                 
                 {/* Color Mode */}
                 <div>
                    <label className="block text-xl font-medium text-zinc-800 dark:text-zinc-200 mb-6">{t.colorMode}</label>
                    <div className="grid grid-cols-3 gap-6">
                       {['light', 'auto', 'dark'].map((mode) => (
                         <div key={mode} className="flex flex-col gap-3">
                             <button 
                               onClick={() => handleChange('theme', mode)}
                               className={`h-32 w-full rounded-2xl border-2 transition-all overflow-hidden relative group ${
                                   settings.theme === mode 
                                   ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/20' 
                                   : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                               }`}
                             >
                                {mode === 'light' && <div className="absolute inset-0 bg-[#f4f4f5]">
                                    <div className="absolute top-4 left-4 right-4 h-3 rounded-full bg-white shadow-sm"></div>
                                    <div className="absolute top-10 left-4 w-1/2 h-3 rounded-full bg-white shadow-sm"></div>
                                    <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-[#d97757]"></div>
                                </div>}
                                
                                {mode === 'dark' && <div className="absolute inset-0 bg-claude-bg">
                                     <div className="absolute top-4 left-4 right-4 h-3 rounded-full bg-claude-panel"></div>
                                     <div className="absolute top-10 left-4 w-1/2 h-3 rounded-full bg-claude-panel"></div>
                                     <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-[#d97757]"></div>
                                </div>}
                                
                                {mode === 'auto' && (
                                  <div className="absolute inset-0 flex">
                                    <div className="w-1/2 bg-[#f4f4f5] relative">
                                        <div className="absolute top-4 left-4 right-2 h-3 rounded-l-full bg-white"></div>
                                    </div>
                                    <div className="w-1/2 bg-claude-bg relative">
                                        <div className="absolute top-4 left-0 right-4 h-3 rounded-r-full bg-claude-panel"></div>
                                        <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-[#d97757]"></div>
                                    </div>
                                  </div>
                                )}
                             </button>
                             <span className="text-center text-lg capitalize text-zinc-600 dark:text-zinc-300">{mode}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Chat Font */}
                 <div className="mt-10">
                   <label className="block text-xl font-medium text-zinc-800 dark:text-zinc-200 mb-6">{t.chatFont}</label>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {[
                       { id: 'default', name: 'Default', fontClass: 'font-serif' },
                       { id: 'sans', name: 'Sans', fontClass: 'font-sans' },
                       { id: 'system', name: 'System', fontClass: 'font-system' },
                       { id: 'dyslexic', name: 'Dyslexic friendly', fontClass: 'font-dyslexic' }
                     ].map((fontOpt) => (
                       <div key={fontOpt.id} className="flex flex-col gap-3">
                           <button
                             onClick={() => handleChange('font', fontOpt.id)}
                             className={`h-32 w-full rounded-2xl border-2 flex items-center justify-center transition-all ${
                               settings.font === fontOpt.id 
                                 ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/20 bg-transparent' 
                                 : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-transparent'
                             }`}
                           >
                              <span className={`text-4xl text-zinc-900 dark:text-white ${fontOpt.fontClass}`}>
                                {isRtl ? 'أ ب' : 'Aa'}
                              </span>
                           </button>
                           <span className="text-center text-lg text-zinc-600 dark:text-zinc-300">{fontOpt.name}</span>
                       </div>
                     ))}
                   </div>
                 </div>
              </section>

              {/* Profile Section */}
              <section className="space-y-6 pt-6">
                <h3 className="text-lg font-medium border-b border-gray-200 dark:border-[#27272a] pb-2">{t.profile}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">{t.fullName}</label>
                    <input 
                      type="text" 
                      value={settings.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-claude-panel border border-transparent focus:border-zinc-400 dark:focus:border-zinc-600 rounded-lg py-2 px-3 text-sm text-zinc-900 dark:text-[#ececec] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">{t.nickname}</label>
                    <input 
                      type="text" 
                      value={settings.nickname}
                      onChange={(e) => handleChange('nickname', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-claude-panel border border-transparent focus:border-zinc-400 dark:focus:border-zinc-600 rounded-lg py-2 px-3 text-sm text-zinc-900 dark:text-[#ececec] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">{t.workDesc}</label>
                   <div className="relative">
                    <select 
                      value={settings.workFunction}
                      onChange={(e) => handleChange('workFunction', e.target.value)}
                      className="w-full appearance-none bg-gray-50 dark:bg-claude-panel border border-transparent focus:border-zinc-400 dark:focus:border-zinc-600 rounded-lg py-2 px-3 text-sm text-zinc-900 dark:text-[#ececec] outline-none transition-all cursor-pointer"
                    >
                      <option value="" disabled>Select your work function</option>
                      <option value="engineering">Engineering</option>
                      <option value="product">Product Management</option>
                      <option value="marketing">Marketing</option>
                      <option value="research">Research</option>
                      <option value="other">Other</option>
                    </select>
                    <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 ${isRtl ? 'left-3' : 'right-3'}`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">{t.preferences}</label>
                  <p className="text-xs text-zinc-500 mb-2">{t.prefHint}</p>
                  <textarea 
                    value={settings.preferences}
                    onChange={(e) => handleChange('preferences', e.target.value)}
                    placeholder={settings.language === 'en' ? "e.g. ask clarifying questions before giving detailed answers" : "مثال: اطرح أسئلة توضيحية قبل إعطاء إجابات مفصلة"}
                    rows={3}
                    className="w-full bg-gray-50 dark:bg-claude-panel border border-transparent focus:border-zinc-400 dark:focus:border-zinc-600 rounded-lg py-2 px-3 text-sm text-zinc-900 dark:text-[#ececec] placeholder-zinc-400 dark:placeholder-zinc-500 outline-none resize-none transition-all"
                  />
                </div>
              </section>

              {/* Language Section */}
              <section className="space-y-6">
                 <h3 className="text-lg font-medium border-b border-gray-200 dark:border-[#27272a] pb-2">{t.language}</h3>
                 <div>
                   <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">{t.interfaceLang}</label>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => handleChange('language', 'en')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${settings.language === 'en' ? 'bg-[#d97757] border-[#d97757] text-white' : 'border-zinc-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-claude-panel text-zinc-700 dark:text-zinc-300'}`}
                      >
                        English
                      </button>
                      <button 
                        onClick={() => handleChange('language', 'ar')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${settings.language === 'ar' ? 'bg-[#d97757] border-[#d97757] text-white' : 'border-zinc-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-claude-panel text-zinc-700 dark:text-zinc-300'}`}
                      >
                        العربية
                      </button>
                   </div>
                 </div>
              </section>

              {/* Notifications */}
              <section className="space-y-6">
                <h3 className="text-lg font-medium border-b border-gray-200 dark:border-[#27272a] pb-2">{t.notifications}</h3>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-zinc-900 dark:text-[#ececec]">{t.responseComp}</div>
                    <div className="text-sm text-zinc-500 mt-1 max-w-md">{t.responseHint}</div>
                  </div>
                  <button 
                    onClick={() => handleChange('notifications', !settings.notifications)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${settings.notifications ? 'bg-[#d97757]' : 'bg-gray-300 dark:bg-[#3f3f46]'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        settings.notifications 
                          ? (isRtl ? 'right-6' : 'left-6') 
                          : (isRtl ? 'right-1' : 'left-1')
                    }`}></div>
                  </button>
                </div>
              </section>

            </div>
          )}

          {activeTab === 'Account' && (
            <div className="space-y-6">
                <h3 className="text-lg font-medium border-b border-gray-200 dark:border-[#27272a] pb-2">{t.account}</h3>
                <div className="bg-gray-50 dark:bg-claude-panel p-4 rounded-lg border border-gray-200 dark:border-zinc-700">
                    <div className="text-sm text-zinc-500 dark:text-zinc-300 mb-2">Email</div>
                    <div className="text-zinc-900 dark:text-white font-medium">user@example.com</div>
                </div>
                <div>
                   <button className="text-[#d97757] hover:underline text-sm font-medium block mb-4">{t.logout}</button>
                   <button className="text-red-500 hover:underline text-sm font-medium">{t.deleteAccount}</button>
                </div>
            </div>
          )}

          {activeTab === 'Privacy' && (
             <div className="space-y-6">
                <h3 className="text-lg font-medium border-b border-gray-200 dark:border-[#27272a] pb-2">{t.privacy}</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-claude-panel rounded-lg">
                    <span className="text-sm text-zinc-600 dark:text-zinc-300">{t.allowTraining}</span>
                     <button className="w-11 h-6 rounded-full bg-gray-300 dark:bg-[#3f3f46] relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                    </button>
                </div>
                <button className="text-[#d97757] hover:underline text-sm font-medium">{t.exportData}</button>
             </div>
          )}

          {activeTab === 'Billing' && (
             <div className="space-y-6">
                 <h3 className="text-lg font-medium border-b border-gray-200 dark:border-[#27272a] pb-2">{t.billing}</h3>
                 <div className="bg-gradient-to-r from-[#d97757]/10 to-gray-50 dark:to-zinc-800 p-6 rounded-xl border border-[#d97757]/30">
                     <h4 className="font-medium text-lg mb-2 text-zinc-900 dark:text-white">Free Plan</h4>
                     <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">You are currently on the free tier.</p>
                     <button className="bg-[#d97757] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e08c6f] transition-colors">
                         {t.upgrade}
                     </button>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-gray-50 dark:bg-claude-panel rounded-lg text-sm text-zinc-600 dark:text-zinc-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                         {t.paymentMethods}
                     </div>
                     <div className="p-4 bg-gray-50 dark:bg-claude-panel rounded-lg text-sm text-zinc-600 dark:text-zinc-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                         {t.invoices}
                     </div>
                 </div>
             </div>
          )}

          {activeTab === 'Capabilities' && (
             <div className="space-y-6">
                 <h3 className="text-lg font-medium border-b border-gray-200 dark:border-[#27272a] pb-2">{t.capabilities}</h3>
                 <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-claude-panel rounded-lg">
                        <div>
                            <div className="font-medium text-zinc-900 dark:text-white">{t.betaFeatures}</div>
                            <div className="text-xs text-zinc-500">Access new features before they are released</div>
                        </div>
                        <button className="w-11 h-6 rounded-full bg-gray-300 dark:bg-[#3f3f46] relative">
                            <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                        </button>
                     </div>
                 </div>
             </div>
          )}

           {activeTab === 'Connectors' && (
             <div className="space-y-6">
                 <h3 className="text-lg font-medium border-b border-gray-200 dark:border-[#27272a] pb-2">{t.connectors}</h3>
                 <div className="text-center py-10 text-zinc-500">
                     <p className="mb-4">{t.connectedApps}</p>
                     <button className="border border-zinc-300 dark:border-zinc-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-white">
                         Google Drive (Not connected)
                     </button>
                 </div>
             </div>
          )}

           {activeTab === 'Claude Code' && (
             <div className="space-y-6">
                 <h3 className="text-lg font-medium border-b border-gray-200 dark:border-[#27272a] pb-2">{t.biazaCode}</h3>
                  <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-claude-panel rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-zinc-900 dark:text-[#ececec]">{t.enableCode}</div>
                    <div className="text-sm text-zinc-500 mt-1 max-w-md">Allow biaza to run code to solve complex math and data problems.</div>
                  </div>
                  <button className="w-11 h-6 rounded-full bg-[#d97757] relative">
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 ${isRtl ? 'right-6' : 'left-6'}`}></div>
                  </button>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsView;