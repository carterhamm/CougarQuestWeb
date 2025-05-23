type Props = {
  title: string
  description: string
}

export default function QuestCard({ title, description }: Props) {
  return (
    <div className="bg-white text-gray-900 p-6 rounded-xl shadow-md hover:shadow-xl transition w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}