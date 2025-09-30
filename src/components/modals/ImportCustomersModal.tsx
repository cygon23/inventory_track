import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";
import { CustomerInput } from "@/lib/customerService";

interface ImportCustomersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (customers: CustomerInput[], fileName: string) => void;
}

const ImportCustomersModal: React.FC<ImportCustomersModalProps> = ({
  open,
  onOpenChange,
  onImport,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setValidationErrors([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate and preview data
      const errors: string[] = [];
      const preview = jsonData.slice(0, 5); // Show first 5 rows for preview

      // Check required columns
      const requiredColumns = ["name", "email"];
      const firstRow = jsonData[0] as any;
      if (firstRow) {
        const columns = Object.keys(firstRow).map((k) => k.toLowerCase());
        requiredColumns.forEach((col) => {
          if (!columns.includes(col)) {
            errors.push(`Missing required column: ${col}`);
          }
        });
      }

      // Validate email format in preview
      preview.forEach((row: any, index) => {
        const email = row.email || row.Email;
        if (email && !/\S+@\S+\.\S+/.test(email)) {
          errors.push(`Invalid email format in row ${index + 2}: ${email}`);
        }
      });

      setValidationErrors(errors);
      setPreviewData(preview);
    } catch (error) {
      toast({
        title: "File Processing Error",
        description: "Could not read the Excel file. Please check the format.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (!selectedFile || validationErrors.length > 0) {
      toast({
        title: "Cannot Import",
        description: "Please fix validation errors before importing.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const customers: CustomerInput[] = jsonData.map((row: any) => {
          // Parse preferences if they exist
          let preferences: string[] = [];
          if (row.preferences || row.Preferences) {
            const prefString = row.preferences || row.Preferences;
            if (typeof prefString === "string") {
              preferences = prefString
                .split(",")
                .map((p: string) => p.trim())
                .filter(Boolean);
            }
          }

          // Handle name variations
          let name = row.name || row.Name || "";
          if (
            !name &&
            (row.firstName || row.first_name || row.lastName || row.last_name)
          ) {
            const firstName = row.firstName || row.first_name || "";
            const lastName = row.lastName || row.last_name || "";
            name = `${firstName} ${lastName}`.trim();
          }

          return {
            name,
            email: row.email || row.Email || "",
            phone: row.phone || row.Phone || row.phoneNumber || "",
            country: row.country || row.Country || "",
            status: (row.status || row.Status || "new").toLowerCase(),
            total_spent: row.totalSpent || row.total_spent || "$0",
            upcoming_trip: row.upcomingTrip || row.upcoming_trip || null,
            preferences,
          };
        });

        onImport(customers, selectedFile.name);
        handleClose();
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to process the Excel file.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setValidationErrors([]);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1-555-0123",
        country: "United States",
        status: "active",
        total_spent: "$12,800",
        preferences: "Wildlife Photography, Luxury Lodges",
        upcoming_trip: "3-Day Serengeti Explorer",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "customer_import_template.xlsx");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <FileSpreadsheet className='h-5 w-5' />
            <span>Import Customers from Excel</span>
          </DialogTitle>
          <DialogDescription>
            Upload an Excel file to import multiple customers at once. Each
            customer will be assigned a unique LT-XXXX ID automatically.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Template Download */}
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-semibold'>Download Template</h3>
                  <p className='text-sm text-muted-foreground'>
                    Get the Excel template with the correct column format
                  </p>
                </div>
                <Button variant='outline' onClick={downloadTemplate}>
                  <FileSpreadsheet className='h-4 w-4 mr-2' />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardContent className='p-6'>
              <div className='space-y-4'>
                <Label>Select Excel File</Label>
                <div
                  className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors'
                  onClick={() => fileInputRef.current?.click()}>
                  <Upload className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
                  <p className='text-lg font-medium'>
                    {selectedFile
                      ? selectedFile.name
                      : "Click to select Excel file"}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    Supports .xlsx, .xls files
                  </p>
                </div>
                <Input
                  ref={fileInputRef}
                  type='file'
                  accept='.xlsx,.xls'
                  onChange={handleFileSelect}
                  className='hidden'
                />
              </div>
            </CardContent>
          </Card>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Card className='border-destructive'>
              <CardContent className='p-4'>
                <div className='flex items-center space-x-2 mb-3'>
                  <AlertCircle className='h-5 w-5 text-destructive' />
                  <h3 className='font-semibold text-destructive'>
                    Validation Errors
                  </h3>
                </div>
                <div className='space-y-2'>
                  {validationErrors.map((error, index) => (
                    <div key={index} className='flex items-center space-x-2'>
                      <X className='h-4 w-4 text-destructive' />
                      <span className='text-sm'>{error}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Preview */}
          {previewData.length > 0 && (
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center space-x-2 mb-3'>
                  <CheckCircle className='h-5 w-5 text-success' />
                  <h3 className='font-semibold'>Data Preview (First 5 rows)</h3>
                </div>
                <div className='overflow-x-auto'>
                  <table className='min-w-full text-sm'>
                    <thead>
                      <tr className='border-b'>
                        {Object.keys(previewData[0] || {}).map((key) => (
                          <th key={key} className='text-left p-2 font-medium'>
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className='border-b'>
                          {Object.values(row).map((value: any, cellIndex) => (
                            <td key={cellIndex} className='p-2'>
                              {String(value || "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-3 pt-4'>
            <Button
              onClick={handleImport}
              disabled={
                !selectedFile || validationErrors.length > 0 || isProcessing
              }
              className='flex-1'>
              {isProcessing ? "Processing..." : "Import Customers"}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='flex-1'>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportCustomersModal;
