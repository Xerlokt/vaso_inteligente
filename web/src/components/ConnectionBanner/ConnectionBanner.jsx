import styles from './ConnectionBanner.module.css';

const statusConfig = {
  connected:    { color: '#89E55E', bg: 'rgba(137, 229, 94, 0.15)',  text: 'Conectado ao vaso' },
  connecting:   { color: '#FFDF6D', bg: 'rgba(255, 223, 109, 0.15)', text: 'Conectando...' },
  disconnected: { color: '#F96F6F', bg: 'rgba(249, 111, 111, 0.15)', text: 'Desconectado' },
  error:        { color: '#F96F6F', bg: 'rgba(249, 111, 111, 0.15)', text: 'Erro de conexão' },
};

export default function ConnectionBanner({ status }) {
  const config = statusConfig[status] ?? statusConfig.connecting;

  return (
    <div className={styles.banner} style={{ '--dot-color': config.color, '--bg-color': config.bg }}>
      <span className={styles.dot} />
      <span className={styles.text}>{config.text}</span>
    </div>
  );
}
