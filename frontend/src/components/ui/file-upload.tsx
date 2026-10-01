"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { motion } from "motion/react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

interface FileUploadProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  accept?: DropzoneOptions["accept"];
  maxSize?: number; // in bytes
}

export const FileUploadStruc: React.FC<FileUploadProps> = ({
  value,
  onChange,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const [internalFile, setInternalFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Allow controlled (from react-hook-form) or uncontrolled usage
  const currentFile = value !== undefined ? value : internalFile;

  const handleFileSelect = (newFile: File | null) => {
    setInternalFile(newFile);
    onChange?.(newFile);
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: !!currentFile, // Don't trigger file picker on click if a file is already loaded
    onDrop: handleDrop,
    onDropRejected: (rejections) => {
      console.warn("File rejected:", rejections);
    },
    accept,
    maxSize,
  });

  const formatFileSize = (size: number) => {
    if (size < 1024 * 1024) {
      return (size / 1024).toFixed(1) + " KB";
    }
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString();

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        whileHover={currentFile ? undefined : "animate"}
        className={cn(
          "p-6 group/file block rounded-lg w-full relative overflow-hidden border border-dashed border-muted transition-colors",
          !currentFile && "cursor-pointer hover:border-primary/50",
        )}>
        <input {...getInputProps()} ref={fileInputRef} className="hidden" />

        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-bold text-foreground text-lg">
            {currentFile ? "File Selected" : "Upload document"}
          </p>
          <p className="relative z-20 font-normal text-muted-foreground text-sm mt-1 text-center">
            {currentFile
              ? "To change the file, remove the current one first."
              : "Drag or drop your file here or click to browse"}
          </p>

          <div className="relative w-full mt-6 max-w-xl mx-auto">
            {currentFile ? (
              <FileItem
                file={currentFile}
                formatFileSize={formatFileSize}
                formatDate={formatDate}
                onRemove={handleRemove}
              />
            ) : (
              <EmptyState isDragActive={isDragActive} />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Subcomponents ---

interface FileItemProps {
  file: File;
  formatFileSize: (size: number) => string;
  formatDate: (timestamp: number) => string;
  onRemove: (e: React.MouseEvent) => void;
}

const FileItem: React.FC<FileItemProps> = ({
  file,
  formatFileSize,
  formatDate,
  onRemove,
}) => (
  <motion.div
    layoutId="file-upload"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative overflow-hidden z-40 bg-card border flex flex-col justify-between p-4 w-full rounded-md shadow-sm">
    <div className="flex justify-between items-start gap-4">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
          <FileText size={20} />
        </div>
        <div className="truncate">
          <p className="text-sm font-medium text-foreground truncate max-w-[280px]">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            modified {formatDate(file.lastModified)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded-md px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground shrink-0">
          {formatFileSize(file.size)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={onRemove}>
          <X size={16} />
        </Button>
      </div>
    </div>
  </motion.div>
);

const EmptyState: React.FC<{ isDragActive: boolean }> = ({ isDragActive }) => (
  <div className="relative flex items-center justify-center h-28 w-full">
    <motion.div
      layoutId="file-upload"
      variants={mainVariant}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group-hover/file:shadow-xl z-40 bg-card border flex items-center justify-center h-24 w-24 rounded-md shadow-sm transition-shadow">
      {isDragActive ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-primary font-medium flex flex-col items-center gap-1">
          <Upload size={20} className="text-primary animate-bounce" />
          Drop
        </motion.div>
      ) : (
        <Upload size={20} className="text-muted-foreground shrink-0" />
      )}
    </motion.div>

    <motion.div
      variants={secondaryVariant}
      className="absolute border border-dashed border-primary/50 z-30 bg-primary/5 flex items-center justify-center h-24 w-24 rounded-md"
    />
  </div>
);

export default FileUploadStruc;
