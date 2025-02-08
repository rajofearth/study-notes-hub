'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const NavigationBar = ({ onBack, breadcrumbItems }) => {
  return (
    <nav className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <Button variant="ghost" onClick={onBack} className="mb-4 sm:mb-0" aria-label="Go back">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <div className="w-full sm:w-auto">
        <Breadcrumb items={breadcrumbItems} />
      </div>
    </nav>
  );
};

export default NavigationBar;
