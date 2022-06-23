import { useNotionContext } from '../contexts/NotionContext'

const PropertySelect: React.FC = () => {
  const { properties } = useNotionContext()
  return (
    <div>
      {properties &&
        Object.keys(properties).map((key) => (
          <div key={key}>
            <h3>{key}</h3>
          </div>
        ))}
    </div>
  )
}

export default PropertySelect
