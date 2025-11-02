import React from 'react';
import InteractiveSheet from '../SheetCreator/InteractiveSheet';

interface BlankSheetProps {
  isDarkMode?: boolean;
}

const BlankSheet: React.FC<BlankSheetProps> = ({ isDarkMode = false }) => (
  <InteractiveSheet isDarkMode={isDarkMode} />
);

export default BlankSheet;
