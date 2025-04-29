import { Link } from "react-router-dom"

export default function Breadcrumb(breadcrumbs, color = "#6D6D6D") { 
  return (
    <>
      <nav aria-label="breadcrumb" >
        <ol className="breadcrumb text-muted">
        {Array.isArray(breadcrumbs.breadcrumbs) && breadcrumbs.breadcrumbs.length > 0 ? (
              breadcrumbs.breadcrumbs.map((item, index) =>( 
                <li key={item.name} className="breadcrumb-item">
                  <Link to={item.path} style={    {color: (index+1 == breadcrumbs.breadcrumbs.length)?"#121212":color}            }>{item.name}</Link>
                </li>)
              )
            ) : ""}
        </ol>
      </nav>
    </>
  )
}
