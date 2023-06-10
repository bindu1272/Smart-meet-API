module.exports = {
    
    validateBelongsToSame : `
        SELECT COUNT(*) AS total_count FROM (
            SELECT {duplicateColumnName} FROM {tableName}
            WHERE {columnName} IN ({whereInArr})
            GROUP BY {duplicateColumnName} 
        ) AS a LIMIT 1;
    `,
   
 }