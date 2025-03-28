
import { CreditCard, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionType } from "@/types/transaction";

interface CreditBalanceProps {
  balance: number;
  recentTransactions: TransactionType[];
}

export function CreditBalance({ balance, recentTransactions }: CreditBalanceProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Credit Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <span className="text-3xl font-bold">{balance}</span>
          <span className="text-sm text-muted-foreground">
            Credits Available
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Recent Transactions</h4>
          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {transaction.type === "credit" ? (
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">{transaction.description}</span>
                  </div>
                  <span className={`font-medium ${
                    transaction.type === "credit" ? "text-green-500" : "text-red-500"
                  }`}>
                    {transaction.type === "credit" ? "+" : "-"}{transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No recent transactions
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
