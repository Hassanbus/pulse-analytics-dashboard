// The title row at the top of every page.
// React 19 moves the <title> tag into <head>, so the browser tab shows the page name too.
export default function PageHeader({ title, description, actions }) {
  return (
    <div className="page-header">
      <title>{`${title} · Pulse`}</title>
      <div>
        <h1 className="page-header__title">{title}</h1>
        {description && <p className="page-header__description">{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  )
}
