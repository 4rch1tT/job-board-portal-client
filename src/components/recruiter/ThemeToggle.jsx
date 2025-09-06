import React, { useState } from 'react'
import { Switch } from "../ui/switch";
import { Sun,Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center space-x-3">
          <Sun className="size-4" />
          <Switch
            checked={checked}
            onCheckedChange={(value) => setChecked(value)}
            aria-label="Toggle theme"
          />
          <Moon className="size-4" />
        </div>
  )
}

export default ThemeToggle