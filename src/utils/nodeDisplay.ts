// Adapts each category's differently-shaped data into a common display model
// so card/dialog rendering doesn't need to know about each data type.

export type NodeDisplay = {
  badge?: string;
  title: string;
  subtitle?: string;
  bodyLines: string[];
  tags?: string[];
  link?: string;
};

export function getNodeDisplay(category: string, data: any): NodeDisplay {
  switch (category) {
    case "Career":
      return {
        badge: data.year,
        title: data.title,
        subtitle: data.company,
        bodyLines: data.responsibilities ?? [],
        tags: data.technologies,
      };

    case "Education":
      return {
        badge: data.year,
        title: data.degree,
        subtitle: `${data.institution} • ${data.fieldOfStudy}`,
        bodyLines: data.achievements ?? [],
      };

    case "Side Projects":
      return {
        badge: data.year,
        title: data.name,
        subtitle: data.technologies?.join(" • "),
        bodyLines: [data.description],
        tags: data.technologies,
        link: data.link,
      };

    case "Skills":
      return {
        badge: `${data.yearsOfExperience}+ yrs`,
        title: data.name,
        subtitle: data.category,
        bodyLines: [`Proficiency: ${data.level}/10`],
      };

    case "Hobbies":
      return {
        title: data.name,
        bodyLines: [data.description],
      };

    case "Contact":
      return {
        badge: data.platform,
        title: data.label,
        subtitle: data.value,
        bodyLines: [],
        link: data.link,
      };

    default:
      return {
        title: data.title ?? data.name ?? "Untitled",
        bodyLines: [],
      };
  }
}
