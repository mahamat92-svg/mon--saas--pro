import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { type, data, filename } = await request.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'Aucune donnée à exporter' }, { status: 400 });
    }

    // Extract headers
    const keys = Object.keys(data[0]).filter((k) => typeof data[0][k] !== 'object');
    const headerRow = keys.join(';');

    // Extract rows
    const rows = data.map((item) =>
      keys
        .map((k) => {
          const val = item[k] ?? '';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(';')
    );

    const csvContent = [headerRow, ...rows].join('\r\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename || 'export.csv'}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la génération CSV' }, { status: 500 });
  }
}
