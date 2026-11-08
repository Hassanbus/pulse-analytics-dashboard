import Icon from './Icon.jsx'

// A friendly message for "nothing to show here", with an optional action button.
// "as" lets a full page (like the 404 page) use it as its main <h1> heading.
export default function EmptyState({ title, message, icon = 'empty', as: Heading = 'h2', children }) {
  return (
    <div className="empty-state">
      <Icon name={icon} size={32} className="empty-state__icon" />
      <Heading className="empty-state__title">{title}</Heading>
      {message && <p className="empty-state__message">{message}</p>}
      {children && <div className="empty-state__actions">{children}</div>}
    </div>
  )
}
