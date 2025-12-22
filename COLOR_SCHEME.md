# Schema Colori IOV

Questo documento descrive lo schema colori del progetto basato sul design dell'Istituto Oncologico Veneto.

## Colori Principali

### Blu Scuro (Header)
- **`iov-dark-blue`** (`#1e3a5f`): Colore principale per l'header
- **`iov-dark-blue-hover`** (`#152a47`): Variante hover per elementi interattivi

**Utilizzo:**
```tsx
className="bg-iov-dark-blue text-white"
className="bg-iov-dark-blue-hover"
```

### Giallo IOV (Pulsanti e Card Principali)
- **`iov-yellow`** (`#FFD700`): Giallo principale per pulsanti e card
- **`iov-yellow-light`** (`#FFE44D`): Variante chiara
- **`iov-yellow-dark`** (`#E6C200`): Variante scura per hover

**Utilizzo:**
```tsx
className="bg-iov-yellow text-iov-dark-blue"
className="bg-iov-yellow-dark hover:bg-iov-yellow"
```

### Blu Chiaro (Card Servizi)
- **`iov-light-blue`** (`#B3E5FC`): Blu chiaro per card servizi
- **`iov-light-blue-light`** (`#E1F5FE`): Variante molto chiara
- **`iov-light-blue-dark`** (`#81D4FA`): Variante scura

**Utilizzo:**
```tsx
className="bg-iov-light-blue text-iov-dark-blue"
className="bg-iov-light-blue-light"
```

### Rosa (Card Ricerca)
- **`iov-pink`** (`#F48FB1`): Rosa principale per card ricerca
- **`iov-pink-light`** (`#F8BBD0`): Variante chiara
- **`iov-pink-dark`** (`#E91E63`): Variante scura

**Utilizzo:**
```tsx
className="bg-iov-pink text-white"
className="bg-iov-pink-light"
```

### Rosso Veneto (Logo Regione)
- **`iov-veneto-red`** (`#C8102E`): Rosso per elementi Regione Veneto

**Utilizzo:**
```tsx
className="bg-iov-veneto-red text-white"
```

### Grigi (Testi e Sfondi)
- **`iov-gray-text`** (`#333333`): Testo principale
- **`iov-gray-light`** (`#F5F5F5`): Sfondo chiaro

**Utilizzo:**
```tsx
className="text-iov-gray-text"
className="bg-iov-gray-light"
```

## Gradienti

### Gradiente Principale
- **`bg-iov-gradient`**: Gradiente blu chiaro a bianco (da in alto a sinistra a in basso a destra)
- **`bg-iov-gradient-alt`**: Gradiente alternativo con tre colori

**Utilizzo:**
```tsx
className="bg-iov-gradient"
className="bg-iov-gradient-alt"
```

## Esempi di Utilizzo

### Header
```tsx
<header className="bg-iov-dark-blue text-white">
  {/* Contenuto header */}
</header>
```

### Pulsante Principale
```tsx
<button className="bg-iov-yellow text-iov-dark-blue px-6 py-3 rounded-lg hover:bg-iov-yellow-dark transition-colors">
  DONA ORA
</button>
```

### Card Gialla (Sezione Principale)
```tsx
<div className="bg-iov-yellow rounded-lg p-6 hover:bg-iov-yellow-dark transition-colors">
  {/* Contenuto card */}
</div>
```

### Card Blu Chiaro (Servizi)
```tsx
<div className="bg-iov-light-blue rounded-lg p-6 hover:bg-iov-light-blue-dark transition-colors">
  {/* Contenuto card */}
</div>
```

### Card Rosa (Ricerca)
```tsx
<div className="bg-iov-pink rounded-lg p-6 hover:bg-iov-pink-dark transition-colors">
  {/* Contenuto card */}
</div>
```

### Sfondo Principale
```tsx
<div className="min-h-screen bg-iov-gradient">
  {/* Contenuto principale */}
</div>
```

## Palette Completa

| Colore | Codice Hex | Utilizzo |
|--------|------------|----------|
| Blu Scuro | `#1e3a5f` | Header principale |
| Giallo IOV | `#FFD700` | Pulsanti e card principali |
| Blu Chiaro | `#B3E5FC` | Card servizi |
| Rosa | `#F48FB1` | Card ricerca |
| Rosso Veneto | `#C8102E` | Logo Regione |
| Grigio Testo | `#333333` | Testi principali |
| Grigio Chiaro | `#F5F5F5` | Sfondi secondari |

