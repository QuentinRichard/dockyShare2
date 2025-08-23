

interface CardProps {
  title: string;
  description: string;
  //link: string;
}

export default function Card({ title, description }: CardProps) {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <p className="card-text">{description}</p>
    </div>
  );
}
