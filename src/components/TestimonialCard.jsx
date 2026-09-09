import { Quote } from "lucide-react";
import Rating from "./Rating";

export default function TestimonialCard({ testimonial }) {
  return (
    <article className="bg-card border-border shadow-card rounded-3xl border p-7">
      <Quote className="text-primary mb-4" size={26} />
      <p className="text-foreground/85 text-sm leading-relaxed">
        "{testimonial.text}"
      </p>
      <Rating value={testimonial.rating} className="mt-5" />
      <div className="mt-4">
        <p className="font-semibold">{testimonial.name}</p>
        <p className="text-muted-foreground text-xs">{testimonial.role}</p>
      </div>
    </article>
  );
}
