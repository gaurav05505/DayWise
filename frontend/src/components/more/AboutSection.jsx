import React from 'react';
import { Info, MessageSquare, Sparkles } from 'lucide-react';
import { SettingsSection } from './SettingsSection.jsx';
import { SettingsItem } from './SettingsItem.jsx';

export const AboutSection = () => {
  const handleFeedback = () => {
    window.open('https://github.com', '_blank');
  };

  return (
    <SettingsSection title="About DayWise">
      <SettingsItem
        icon={Sparkles}
        iconColor="#55F130"
        title="DayWise"
        subtitle="Version 1.0.0"
        value="v1.0.0"
        showChevron={false}
      />
      <SettingsItem
        icon={Info}
        iconColor="#38BDF8"
        title="About"
        subtitle="A simple app to manage attendance, budgets, and personal goals."
        showChevron={false}
      />
      <SettingsItem
        icon={MessageSquare}
        iconColor="#10B981"
        title="Feedback"
        subtitle="Help improve DayWise"
        onClick={handleFeedback}
      />
    </SettingsSection>
  );
};
