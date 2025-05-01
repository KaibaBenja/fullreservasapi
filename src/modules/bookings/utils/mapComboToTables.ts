export type TableMapCombo = {
  table_id: string;
  guests: number;
  remaining: number;
};

export type AssignmentMapCombo = {
  table_id: string;
  guests: number;
};

export function mapComboToTables(
  combo: number[],
  availableTables: TableMapCombo[]
): AssignmentMapCombo[] | null {
  const assignments: AssignmentMapCombo[] = [];

  // Agrupar por capacidad
  const grouped: Record<number, TableMapCombo[]> = {};

  for (const table of availableTables) {
    if (!grouped[table.guests]) {
      grouped[table.guests] = [];
    }
    grouped[table.guests].push({ ...table });
  }

  // Ordenar cada grupo por mayor disponibilidad
  for (const guestCount in grouped) {
    grouped[+guestCount].sort((a, b) => b.remaining - a.remaining);
  }

  // Intentar asignar mesas para cada valor del combo
  for (const guestsNeeded of combo) {
    const tablesOfSize = grouped[guestsNeeded];
    if (!tablesOfSize || tablesOfSize.length === 0) return null;

    let assigned = false;
    for (const table of tablesOfSize) {
      if (table.remaining > 0) {
        assignments.push({
          table_id: table.table_id,
          guests: guestsNeeded,
        });
        table.remaining--;
        assigned = true;
        break;
      }
    }

    // if (!assigned) return null; // No hay suficientes mesas disponibles
  }

  return assignments;
}