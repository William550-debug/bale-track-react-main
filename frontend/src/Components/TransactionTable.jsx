import React from 'react';

const TransactionTable = () => {
  const transactions = [
    {
      date: 'Today, 10:45 AM',
      description: 'Cotton bale purchase',
      type: 'Purchase',
      amount: 'Ksh 45,200',
      status: 'Completed'
    },
    {
      date: 'Today, 09:30 AM',
      description: 'Jute bale sale',
      type: 'Sale',
      amount: 'Ksh 68,750',
      status: 'Completed'
    },
    {
      date: 'Yesterday, 03:15 PM',
      description: 'Wool bale purchase',
      type: 'Purchase',
      amount: 'Ksh 32,400',
      status: 'Completed'
    },
    {
      date: 'Yesterday, 11:20 AM',
      description: 'Transport expenses',
      type: 'Expense',
      amount: 'Ksh 12,500',
      status: 'Completed'
    },
    {
      date: '2 days ago, 04:30 PM',
      description: 'Business savings deposit',
      type: 'Savings',
      amount: 'Ksh 50,000',
      status: 'Completed'
    }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
            <th className="pb-3 font-semibold">Date</th>
            <th className="pb-3 font-semibold">Description</th>
            <th className="pb-3 font-semibold">Type</th>
            <th className="pb-3 font-semibold">Amount</th>
            <th className="pb-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 ">
          {transactions.map((transaction, index) => (
            <tr key={index} className='mb-8 mt-5'>
              <td className="py-3 text-xs md:text-sm text-dark dark:text-white">{transaction.date}</td>
              <td className="py-3 text-xs md:text-sm text-dark dark:text-white">{transaction.description}</td>
              <td className="py-3 text-xs md:text-sm text-dark dark:text-white">{transaction.type}</td>
              <td className="py-3 text-xs md:text-sm font-bold text-dark dark:text-white">{transaction.amount}</td>
              <td className="py-3">
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-success dark:text-green-300">
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;