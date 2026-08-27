import React from 'react';
import styles from './DataTable.module.css';

export function DataTable({
  columns,
  data = [],
  keyExtractor,
  isLoading = false,
  emptyMessage = 'Belum ada data pengiriman.',
}) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`${styles.th} ${styles[col.align || 'left']}`}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className={styles.loadingCell}>
                <div className={styles.spinner}></div>
                <span>Memuat data pengiriman...</span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.emptyCell}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)} className={styles.row}>
                {columns.map((col, cIdx) => (
                  <td
                    key={cIdx}
                    className={`${styles.td} ${styles[col.align || 'left']}`}
                  >
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
