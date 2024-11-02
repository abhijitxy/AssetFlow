import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { api } from '~/trpc/react';
import { ArrowRight, Calendar, Loader2 } from 'lucide-react';

interface TransactionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetId: string;
  assetName: string;
}

const TransactionHistoryDialog: React.FC<TransactionHistoryDialogProps> = ({
  open,
  onOpenChange,
  assetId,
  assetName,
}) => {
  const { data: transactions, isLoading } = api.transaction.getByAssetId.useQuery(
    assetId,
    { enabled: open }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-stone-900 border-stone-800 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-white">
            Transaction History - {assetName}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          ) : transactions?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No transactions found for this asset
            </div>
          ) : (
            <div className="space-y-4">
              {transactions?.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 rounded-lg border border-stone-800 bg-stone-800/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{transaction.sender.name}</span>
                      <ArrowRight className="w-4 h-4" />
                      <span>{transaction.receiver.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(transaction.transactionDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionHistoryDialog;