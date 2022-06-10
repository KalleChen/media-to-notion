import { useAppContext } from '../contexts/AppContext'

const PropertySelect: React.FC = () => {
  const { properties } = useAppContext()
  console.log(properties)
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
