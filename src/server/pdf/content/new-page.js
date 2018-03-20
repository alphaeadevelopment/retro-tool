export default (pdf) => {
  let pageNum = 0;
  return () => {
    const page = pdf.addPage({ size: [595, 841] });

    // banner
    page.rect(0, 0, 595, 50)
      .fill('#3a4d55');
    page.rect(0, 811, 595, 30)
      .fill('#3a4d55');

    // title
    page.fontSize(35);
    page
      .fillColor('#fff')
      .text('Retrospective Tool', 10, 10, {
        width: 555,
        align: 'left',
      });

    if (pageNum > 0) {
      page.fontSize(15);
      page
        .fillColor('#fff')
        .text(`${pageNum + 1}`, 10, 20, {
          width: 555,
          align: 'right',
        });
    }
    pageNum++;

    page.fontSize(25).moveDown(2).fillColor('#000');

    return page;
  };
};
