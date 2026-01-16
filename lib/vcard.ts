export function downloadVCard() {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Dani Díaz
N:Díaz;Dani;;;
TITLE:Bilingual Realtor®
ORG:Faircloth Real Estate Group
TEL;TYPE=CELL:+18435035038
EMAIL:danidiazrealestate@gmail.com
URL:https://demo-danidiaz.shortlistpass.com
ADR;TYPE=WORK:;;Myrtle Beach;SC;;USA
NOTE:Your bilingual real estate expert on the Grand Strand.
END:VCARD`;

  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Dani-Diaz-Contact.vcf';
  link.click();
  URL.revokeObjectURL(url);
}
