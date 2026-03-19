# Schéma base de données MySQL

Schéma proposé pour le portfolio avec backoffice et filtres dynamiques par technologie.

---

## Tables

### `admin_users`
Utilisateurs du backoffice.

| Colonne        | Type         | Contraintes     |
|----------------|--------------|-----------------|
| id             | INT          | PK, AUTO_INCREMENT |
| email          | VARCHAR(255) | UNIQUE, NOT NULL   |
| password_hash  | VARCHAR(255) | NOT NULL           |
| created_at     | DATETIME     | DEFAULT CURRENT_TIMESTAMP |
| updated_at     | DATETIME     | ON UPDATE CURRENT_TIMESTAMP |

---

### `technologies`
Technologies utilisées dans les projets (alimente les filtres).

| Colonne   | Type         | Contraintes     |
|-----------|--------------|-----------------|
| id        | INT          | PK, AUTO_INCREMENT |
| name      | VARCHAR(100) | NOT NULL        |
| slug      | VARCHAR(100) | UNIQUE, NOT NULL |
| category  | ENUM('development','systems','methodologies') ou VARCHAR(50) | NULL |
| sort_order| INT          | DEFAULT 0       |
| created_at| DATETIME     | DEFAULT CURRENT_TIMESTAMP |

---

### `projects`
Projets affichés sur la page Projets.

| Colonne      | Type          | Contraintes     |
|--------------|---------------|-----------------|
| id           | INT           | PK, AUTO_INCREMENT |
| slug         | VARCHAR(120)  | UNIQUE, NOT NULL   |
| name         | VARCHAR(200)  | NOT NULL           |
| problem      | TEXT          | NULL (problématique) |
| solution     | TEXT          | NULL              |
| results      | TEXT          | NULL              |
| image_url    | VARCHAR(500)  | NULL              |
| sort_order   | INT           | DEFAULT 0        |
| is_published | TINYINT(1)    | DEFAULT 1        |
| created_at   | DATETIME      | DEFAULT CURRENT_TIMESTAMP |
| updated_at   | DATETIME      | ON UPDATE CURRENT_TIMESTAMP |

---

### `project_technologies`
Table de liaison projet ↔ technologie (N-N). Permet le filtre dynamique par techno.

| Colonne       | Type | Contraintes     |
|---------------|------|-----------------|
| project_id    | INT  | PK, FK → projects.id ON DELETE CASCADE |
| technology_id | INT  | PK, FK → technologies.id ON DELETE CASCADE |

Index recommandé : `(technology_id, project_id)` pour les requêtes de filtre.

---

### `contact_messages` (optionnel)
Stockage des messages du formulaire de contact.

| Colonne   | Type         | Contraintes     |
|-----------|--------------|-----------------|
| id        | INT          | PK, AUTO_INCREMENT |
| name      | VARCHAR(150) | NOT NULL        |
| email     | VARCHAR(255) | NOT NULL        |
| subject   | VARCHAR(255) | NULL            |
| message   | TEXT         | NOT NULL        |
| created_at| DATETIME     | DEFAULT CURRENT_TIMESTAMP |

---

## Exemple de requêtes utiles

- **Projets publiés avec leurs technologies :**  
  `SELECT p.*, GROUP_CONCAT(t.name) as tech_names FROM projects p  
   LEFT JOIN project_technologies pt ON p.id = pt.project_id  
   LEFT JOIN technologies t ON pt.technology_id = t.id  
   WHERE p.is_published = 1 GROUP BY p.id ORDER BY p.sort_order, p.id;`

- **Filtrer par technologie (ex. slug = 'nextjs') :**  
  Joindre `project_technologies` et `technologies` avec `WHERE t.slug = ?`.

---

*À adapter selon ton ORM (Prisma, Drizzle, etc.).*
