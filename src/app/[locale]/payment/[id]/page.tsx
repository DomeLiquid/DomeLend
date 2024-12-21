'use client';

import { BorderBeam } from '@/components/magicui/border-beam';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { TokenSymbol } from '@/components/token-item';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { getPaymentInfo } from '@/lib/actions';
import { useRouter } from '@/navigation';
import { GetPaymentInfoResponse } from '@/types/account';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import Image from 'next/image';
import QRCodeSVG from 'qrcode.react';
import { useEffect, useState } from 'react';

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<GetPaymentInfoResponse | null>(
    null,
  );

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      const paymentInfo = await getPaymentInfo(params.id);
      setPaymentInfo(paymentInfo || null);
    };
    fetchPaymentInfo();
  }, [params.id]);

  useEffect(() => {
    const checkOrderStatus = async () => {
      try {
        const paymentInfo = await getPaymentInfo(params.id);
        setPaymentInfo(paymentInfo || null);
        if (paymentInfo && paymentInfo.status !== 'pending') {
          return true;
        }
        return false;
      } catch (error) {
        console.error('check payment result error:', error);
        return false;
      }
    };

    const intervalId = setInterval(async () => {
      const shouldStop = await checkOrderStatus();
      if (shouldStop) {
        clearInterval(intervalId);
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [params.id]);

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <h1 className="text-center text-2xl font-bold">Fill Order</h1>
      {paymentInfo ? (
        <div>
          <div className="flex items-center justify-center">
            <div className="relative flex w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
              <CardContent className="space-y-4 p-4">
                <div className="flex justify-center">
                  <span className="text-md text-ellipsis font-bold">
                    Action: {paymentInfo.action}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <TokenSymbol
                      asset={paymentInfo.asset}
                      coinIconClassName="h-10 w-10"
                      chainIconClassName="h-5 w-5"
                    />
                    <div>
                      <p className="flex items-center justify-between font-semibold">
                        <div className="text-ellipsis pr-2">
                          {paymentInfo.asset.symbol}
                        </div>
                        <div>
                          <span className="text-md font-bold">
                            <NumberTicker
                              value={parseFloat(paymentInfo.amount)}
                              decimalPlaces={8}
                            />
                          </span>
                        </div>
                      </p>
                      <p className="text-sm text-gray-500">
                        ≈ ${' '}
                        <span className="text-sm">
                          <NumberTicker
                            value={
                              parseFloat(paymentInfo.amount) *
                              paymentInfo.asset.price
                            }
                            decimalPlaces={8}
                          />
                        </span>
                        USD
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  {paymentInfo.payInfo.link && (
                    <QRCodeSVG
                      value={paymentInfo.payInfo.link}
                      size={200}
                      fgColor="#000000"
                      imageSettings={{
                        src: paymentInfo.payInfo.iconURL,
                        height: 50,
                        width: 50,
                        excavate: true,
                      }}
                    />
                  )}
                </div>

                <div className="flex flex-col items-center justify-center">
                  {paymentInfo.status === 'pending' && (
                    <>
                      <div className="mt-4">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="mt-2 text-center text-yellow-500"
                        >
                          Checking
                        </motion.div>
                      </div>
                    </>
                  )}
                  {paymentInfo.status === 'confirmed' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center text-green-500"
                    >
                      <CheckCircle className="mx-auto mb-2 h-8 w-8" />
                      Payment Successful
                    </motion.div>
                  )}
                  {paymentInfo.status === 'failed' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center text-red-500"
                    >
                      <XCircle className="mx-auto mb-2 h-8 w-8" />
                      Processing Failed
                    </motion.div>
                  )}
                </div>
              </CardContent>

              <BorderBeam size={250} duration={12} delay={9} />
            </div>
          </div>
          <p className="p-4 text-center text-sm text-gray-500">
            Click the button below to pay and wait for transaction confirmation.
            You can also leave this page, and we will notify you when the
            transaction is complete.
          </p>
          <Button
            className="w-full"
            disabled={!paymentInfo.payInfo.link}
            onClick={() => {
              router.push(paymentInfo.payInfo.link);
            }}
          >
            {'Pay'}
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl font-semibold">Order not found</p>
          <p className="mt-2 text-gray-500">
            Please check your order information
          </p>
        </div>
      )}

      <div className="text-center">
        <Button variant="link" onClick={() => router.push('/lend')}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default Page;

