import { Link } from "react-router-dom"

export default function Breadcrumb(breadcrumbs) { 
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
        {Array.isArray(breadcrumbs.breadcrumbs) && breadcrumbs.breadcrumbs.length > 0 ? (
              breadcrumbs.breadcrumbs.map(item => 
                <li key={item.name} className="breadcrumb-item"><Link to={item.path}>{item.name}</Link></li>)
            ) : ""}
        </ol>
    </nav>
    </>
  )
}
