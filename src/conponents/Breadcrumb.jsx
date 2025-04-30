import { Link } from "react-router-dom"

export default function Breadcrumb(breadcrumbs) { 
  return (
    <>
      <nav aria-label="breadcrumb" >
        <ol className="breadcrumb">
        {Array.isArray(breadcrumbs.breadcrumbs) && breadcrumbs.breadcrumbs.length > 0 ? (
              breadcrumbs.breadcrumbs.map((item, index) =>( 
                (index+1 != breadcrumbs.breadcrumbs.length)?
                (<li key={item.name} className="breadcrumb-item">
                  <Link to={item.path} >{item.name}</Link>
                </li>)
                :
                <li key={item.name} className="breadcrumb-item active" aria-current="page">
                  {item.name}
                </li>)
              )
            ) : ""}
        </ol>
      </nav>
    </>
  )
}
