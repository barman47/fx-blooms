import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


export const exportRecords = (data, admin, filter) => {
  // setError('');
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  let errors = {};
  console.log('hello')

  if (data.length === 0) {
    errors.msg = 'Cannot an empty list'
    return { errors: errors}
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wsCols = [
      {wpx: 40},
      {wpx: 250},
      {wpx: 250},
      {wpx: 250},
      {wpx: 250},
      {wpx: 250}
  ];
  ws['!cols'] = wsCols;
  // ws['!protect'] = {
  //     selectLockedCells: false
  // };
  // ws['A1'].v = 'This is a test header';
  // const customProps = {
  //     Exported: new Date().toISOString(),
  //     Category: filter,
  //     Admin: `${admin.firstName} ${admin.lastName}`
  // };
  const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }; 

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', Props: {
      Owner: 'FXBLOOMS.com',
      Date: new Date().toISOString(),
      Category: filter,
      Admin: `${admin.firstName} ${admin.lastName}`
  }});

  const usersData = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(usersData, `FXBLOOMS ${filter} - ${new Date().toISOString()}${fileExtension}`);

  return {errors}
}