interface InputProps {
  value: string | number
  onChange: (value: string) => void
}

const Input: React.FC<InputProps> = (props) => {
  const { value, onChange } = props
  return (
    <div>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type="text"
          name="url"
          className="shadow-md outline-0 block w-full px-4 py-2 border-gray-300 rounded-md"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Input
