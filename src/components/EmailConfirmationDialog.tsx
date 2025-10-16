import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Copy,
  CheckCircle2,
  Code,
  Eye,
  FileText,
  Sparkles,
  Send,
} from "lucide-react";
import EmailTemplate from "./EmailTemplate";
import { useEmailGeneration } from "@/hooks/useEmailGeneration";

interface EmailConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emailData: {
    subject: string;
    plainText: string;
    html: string;
    bookingDetails: any;
  } | null;
}

const EmailConfirmationDialog: React.FC<EmailConfirmationDialogProps> = ({
  open,
  onOpenChange,
  emailData,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const { copyToClipboard, openEmailClient } = useEmailGeneration();

  const handleCopy = async (content: string, section: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const handleSendEmail = (client: "gmail" | "outlook") => {
    if (!emailData) return;
    openEmailClient(
      client,
      emailData.subject,
      emailData.plainText,
      emailData.bookingDetails.customerEmail
    );
  };

  if (!emailData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-5xl max-h-[90vh] overflow-hidden flex flex-col'>
        <DialogHeader>
          <DialogTitle className='text-2xl flex items-center gap-2'>
            <Mail className='h-6 w-6 text-primary' />
            Email Confirmation Ready
          </DialogTitle>
          <DialogDescription>
            Review and send the booking confirmation email to your customer
          </DialogDescription>
        </DialogHeader>

        {/* Success Alert */}
        <Alert className='bg-green-50 border-green-200'>
          <Sparkles className='h-4 w-4 text-green-600' />
          <AlertDescription className='text-green-800'>
            Payment processed successfully! Your confirmation email is ready to
            send.
          </AlertDescription>
        </Alert>

        {/* Email Subject and Quick Actions */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between bg-slate-50 p-3 rounded-lg border'>
            <div className='flex-1'>
              <p className='text-xs text-gray-500 mb-1'>Send To:</p>
              <p className='font-semibold text-sm'>
                {emailData.bookingDetails.customerEmail}
              </p>
            </div>
          </div>

          <div className='flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200'>
            <div className='flex-1'>
              <p className='text-xs text-blue-600 mb-1'>Subject:</p>
              <p className='font-semibold text-sm text-blue-900'>
                {emailData.subject}
              </p>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleCopy(emailData.subject, "subject")}
              className='ml-2'>
              {copiedSection === "subject" ? (
                <>
                  <CheckCircle2 className='h-4 w-4 mr-1 text-green-600' />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className='h-4 w-4 mr-1' />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* Quick Send Buttons */}
          <div className='flex gap-3'>
            <Button
              onClick={() => handleSendEmail("gmail")}
              className='flex-1 bg-red-600 hover:bg-red-700 text-white'
              size='lg'>
              <Send className='h-5 w-5 mr-2' />
              Send via Gmail
            </Button>
            <Button
              onClick={() => handleSendEmail("outlook")}
              className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'
              size='lg'>
              <Send className='h-5 w-5 mr-2' />
              Send via Outlook
            </Button>
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue='preview' className='flex-1 flex flex-col min-h-0'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='preview' className='flex items-center gap-2'>
              <Eye className='h-4 w-4' />
              Preview
            </TabsTrigger>
            <TabsTrigger value='plain' className='flex items-center gap-2'>
              <FileText className='h-4 w-4' />
              Plain Text
            </TabsTrigger>
            <TabsTrigger value='html' className='flex items-center gap-2'>
              <Code className='h-4 w-4' />
              HTML
            </TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value='preview' className='flex-1 mt-4 min-h-0'>
            <ScrollArea className='h-[400px] w-full rounded-md border p-4 bg-white'>
              <EmailTemplate bookingDetails={emailData.bookingDetails} />
            </ScrollArea>
            <div className='mt-4 flex gap-2'>
              <Button
                onClick={() => handleCopy(emailData.plainText, "preview")}
                variant='outline'
                className='flex-1'>
                {copiedSection === "preview" ? (
                  <>
                    <CheckCircle2 className='h-4 w-4 mr-2 text-green-600' />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className='h-4 w-4 mr-2' />
                    Copy Plain Text
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleCopy(emailData.html, "html-preview")}
                variant='outline'
                className='flex-1'>
                {copiedSection === "html-preview" ? (
                  <>
                    <CheckCircle2 className='h-4 w-4 mr-2 text-green-600' />
                    Copied!
                  </>
                ) : (
                  <>
                    <Code className='h-4 w-4 mr-2' />
                    Copy HTML
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Plain Text Tab */}
          <TabsContent value='plain' className='flex-1 mt-4 min-h-0'>
            <ScrollArea className='h-[400px] w-full rounded-md border p-4 bg-slate-50'>
              <pre className='text-sm whitespace-pre-wrap font-mono text-gray-800'>
                {emailData.plainText}
              </pre>
            </ScrollArea>
            <div className='mt-4'>
              <Button
                onClick={() => handleCopy(emailData.plainText, "plain")}
                className='w-full'
                size='lg'>
                {copiedSection === "plain" ? (
                  <>
                    <CheckCircle2 className='h-5 w-5 mr-2 text-white' />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className='h-5 w-5 mr-2' />
                    Copy Plain Text to Clipboard
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* HTML Tab */}
          <TabsContent value='html' className='flex-1 mt-4 min-h-0'>
            <ScrollArea className='h-[400px] w-full rounded-md border p-4 bg-slate-50'>
              <pre className='text-xs whitespace-pre-wrap font-mono text-gray-700'>
                {emailData.html}
              </pre>
            </ScrollArea>
            <div className='mt-4'>
              <Button
                onClick={() => handleCopy(emailData.html, "html")}
                className='w-full'
                size='lg'>
                {copiedSection === "html" ? (
                  <>
                    <CheckCircle2 className='h-5 w-5 mr-2 text-white' />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Code className='h-5 w-5 mr-2' />
                    Copy HTML to Clipboard
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Instructions */}
        <Alert>
          <Mail className='h-4 w-4' />
          <AlertDescription className='text-sm'>
            <strong>Quick Send:</strong> Click Gmail or Outlook button above to
            open pre-filled email, or copy the content manually.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailConfirmationDialog;
