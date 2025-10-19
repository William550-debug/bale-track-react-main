import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'

const Feedback = () => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">Feedback Portal</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Review user feedback and suggestions</p>
      <div className="border border-dashed border-gray-200 dark:border-gray-600 rounded-lg h-96 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
        <ChatBubbleLeftEllipsisIcon className="w-12 h-12 mb-4" />
        <p>Feedback portal coming soon</p>
      </div>
    </div>
  )
}

export default Feedback