import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "../lib/emailFormatter";

interface EmailTemplateProps {
  bookingDetails: {
    customerName: string;
    customerEmail: string;
    startDate: string;
    endDate: string;
    itinerary: string;
    numberOfGuests: number;
    specialRequests?: string;
    totalAmount: number;
    paidAmount: number;
    remainingBalance: number;
    bookingReference: string;
    balanceDueDate: string;
  };
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ bookingDetails }) => {
  return (
    <div className='w-full max-w-3xl mx-auto bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-lg'>
      {/* Header */}
      <Card className='mb-6 border-0 shadow-lg bg-gradient-to-r from-blue-900 to-blue-600'>
        <CardHeader className='text-center py-8'>
          <div className='text-4xl mb-3'>🦁</div>
          <h1 className='text-3xl font-bold text-white mb-2'>
            Liontrack Safari Company
          </h1>
          <p className='text-blue-100 text-sm'>
            Follow the Track, Discover the Wilderness
          </p>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card className='mb-6 shadow-lg'>
        <CardContent className='p-8'>
          {/* Greeting */}
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-blue-900 mb-4'>
              Booking Confirmation
            </h2>
            <p className='text-gray-700 mb-3'>
              Dear{" "}
              <span className='font-semibold'>
                {bookingDetails.customerName}
              </span>
              ,
            </p>
            <p className='text-gray-700 mb-3'>
              Warm greetings from Liontrack Safari Company!
            </p>
            <p className='text-gray-700'>
              We are delighted to confirm your booking for your upcoming safari
              adventure with us. Thank you for choosing Liontrack Safari Company
              to craft this unforgettable journey through Tanzania's
              breathtaking wilderness.
            </p>
          </div>

          {/* Payment Received Badge */}
          <div className='bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r'>
            <p className='text-green-800 font-semibold mb-1'>
              ✓ Payment Received: {formatCurrency(bookingDetails.paidAmount)}
            </p>
            <p className='text-green-700 text-sm'>
              We have received your initial payment of 50% of the total safari
              cost.
            </p>
          </div>

          {/* Booking Details */}
          <Card className='mb-6 border-2 border-blue-100'>
            <div className='bg-blue-900 px-6 py-3'>
              <h3 className='text-white font-semibold text-lg'>
                📋 Booking Details
              </h3>
            </div>
            <CardContent className='p-6 bg-slate-50'>
              <div className='space-y-3'>
                <div className='flex justify-between py-2'>
                  <span className='text-gray-600'>Booking Reference:</span>
                  <span className='font-semibold text-gray-900'>
                    {bookingDetails.bookingReference}
                  </span>
                </div>
                <Separator />
                <div className='flex justify-between py-2'>
                  <span className='text-gray-600'>Guest Name:</span>
                  <span className='font-semibold text-gray-900'>
                    {bookingDetails.customerName}
                  </span>
                </div>
                <div className='flex justify-between py-2'>
                  <span className='text-gray-600'>Email:</span>
                  <span className='text-gray-900'>
                    {bookingDetails.customerEmail}
                  </span>
                </div>
                <Separator />
                <div className='flex justify-between py-2'>
                  <span className='text-gray-600'>Travel Dates:</span>
                  <span className='font-semibold text-gray-900'>
                    {formatDate(bookingDetails.startDate)} to{" "}
                    {formatDate(bookingDetails.endDate)}
                  </span>
                </div>
                <div className='flex justify-between py-2'>
                  <span className='text-gray-600'>Itinerary:</span>
                  <span className='text-gray-900'>
                    {bookingDetails.itinerary}
                  </span>
                </div>
                <div className='flex justify-between py-2'>
                  <span className='text-gray-600'>Number of Guests:</span>
                  <span className='font-semibold text-gray-900'>
                    {bookingDetails.numberOfGuests}
                  </span>
                </div>
                {bookingDetails.specialRequests && (
                  <>
                    <Separator />
                    <div className='py-2'>
                      <span className='text-gray-600 block mb-2'>
                        Special Requests:
                      </span>
                      <span className='text-gray-900'>
                        {bookingDetails.specialRequests}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card className='mb-6 border-0 bg-gradient-to-br from-amber-50 to-yellow-100'>
            <div className='bg-amber-600 px-6 py-3'>
              <h3 className='text-white font-semibold text-lg'>
                💰 Payment Summary
              </h3>
            </div>
            <CardContent className='p-6'>
              <div className='space-y-3'>
                <div className='flex justify-between py-2'>
                  <span className='text-amber-900'>Total Cost:</span>
                  <span className='font-bold text-amber-900 text-lg'>
                    {formatCurrency(bookingDetails.totalAmount)}
                  </span>
                </div>
                <div className='flex justify-between py-2'>
                  <span className='text-green-800'>Amount Paid:</span>
                  <span className='font-bold text-green-800 text-lg'>
                    {formatCurrency(bookingDetails.paidAmount)}
                  </span>
                </div>
                <Separator className='bg-amber-300' />
                <div className='flex justify-between py-2 border-t-2 border-amber-300 pt-3'>
                  <span className='text-orange-900 font-semibold text-lg'>
                    Remaining Balance:
                  </span>
                  <span className='font-bold text-orange-900 text-xl'>
                    {formatCurrency(bookingDetails.remainingBalance)}
                  </span>
                </div>
                <div className='flex justify-between py-2'>
                  <span className='text-amber-900'>Balance Due Date:</span>
                  <span className='font-semibold text-amber-900'>
                    {formatDate(bookingDetails.balanceDueDate)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className='mb-6 border-2 border-blue-100'>
            <div className='bg-blue-500 px-6 py-3'>
              <h3 className='text-white font-semibold text-lg'>
                🎯 What's Next?
              </h3>
            </div>
            <CardContent className='p-6 bg-blue-50'>
              <ul className='space-y-3 text-blue-900'>
                <li className='flex items-start'>
                  <span className='mr-2'>•</span>
                  <span>
                    Kindly complete the remaining payment no later than{" "}
                    <strong>45 days prior to arrival</strong>.
                  </span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-2'>•</span>
                  <span>
                    Please share your <strong>arrival details</strong> (flight
                    number and arrival time) if you haven't done so yet.
                  </span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-2'>•</span>
                  <span>
                    Let us know if you have any{" "}
                    <strong>dietary requirements or special needs</strong> to
                    make your safari more comfortable.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className='mb-6 border-2 border-slate-200'>
            <CardContent className='p-6 bg-slate-50'>
              <h3 className='text-blue-900 font-semibold text-base mb-4'>
                📞 Contact Information
              </h3>
              <div className='space-y-2 text-sm text-gray-700'>
                <p>
                  <strong>WhatsApp:</strong> +255 782 247 376
                </p>
                <p>
                  <strong>Office:</strong> +255 682 801 818
                </p>
                <p>
                  <strong>Email:</strong> info@liontracksafari.com
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href='https://liontracksafari.com/'
                    className='text-blue-600 hover:underline'>
                    liontracksafari.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Closing */}
          <div className='text-gray-700'>
            <p className='mb-4'>
              We are dedicated to providing you with exceptional service and an
              authentic Tanzanian safari experience. Should you have any
              questions or need any assistance before your arrival, please do
              not hesitate to contact us.
            </p>
            <p className='mb-6'>
              We look forward to welcoming you soon and sharing the magic of
              Tanzania with you!
            </p>
            <div className='mt-6'>
              <p className='text-blue-900 font-semibold'>Warm regards,</p>
              <p className='text-blue-900 font-bold mt-1'>Pastory Katwe</p>
              <p className='text-gray-600 text-sm'>Managing Director</p>
              <p className='text-gray-600 text-sm'>Liontrack Safari Company</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className='border-0 shadow-lg bg-gradient-to-r from-blue-900 to-blue-600'>
        <CardContent className='text-center py-4'>
          <p className='text-blue-100 text-xs mb-1'>
            © {new Date().getFullYear()} Liontrack Safari Company. All rights
            reserved.
          </p>
          <p className='text-blue-100 text-xs'>
            Follow the Track, Discover the Wilderness
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTemplate;
