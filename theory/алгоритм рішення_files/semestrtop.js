var file='<a href="http://axd.semestr.ru/econ/ravn.php" target="_blank"><img src="http://axd.semestr.ru/images/ravn.gif" alt="����������� ���� ������" title="����������� ���� ������"></a>';
var file1='<a href="http://axd.semestr.ru/econ/lorenc.php" target="_blank"><img src="http://axd.semestr.ru/images/lorenz.gif" alt="������ ������� ������" title="������ ������� ������"></a>';
var file2='<a href="http://axd.semestr.ru" target="_blank"><img src="http://axd.semestr.ru/images/axd.gif" alt="���������� ������" title="���������� ������"></a>';
var file3='<a href="http://math.semestr.ru" target="_blank"><img src="http://math.semestr.ru/images/mathm.gif" alt="��������� � ��������� ������" title="��������� � ��������� ������"></a>';
var file4='<a href="http://axd.semestr.ru/econ/balans.php" target="_blank"><img src="http://axd.semestr.ru/images/balance.gif" alt="������������� ������ ������" title="������������� ������ ������"></a>';
var file5='<a href="http://www.semestr.ru/ks261.html" target="_blank"><img src="http://www.semestr.ru/images/1308093.gif" alt="�������� � ������" title="�������� � ������"></a>';
var file6='<a href="http://www.semestr.ru/ks523.html" target="_blank"><img src="http://www.semestr.ru/images/1308094.gif" alt="����������� � ������" title="����������� � ������"></a>';
var file7='<a href="http://axd.semestr.ru" target="_blank"><img src="http://www.semestr.ru/images/axd468.gif" alt="������ ������������� ������������" title="������ ������������� ������������"></a>';
var file8='<a href="http://axd.semestr.ru" target="_blank"><img src="http://www.semestr.ru/images/stat468.gif" alt="��������� � ����������" title="��������� � ����������"></a>';
var file9='<a href="http://math.semestr.ru/gauss/gauss.php" target="_blank"><img src="http://www.semestr.ru/images/slau468.gif" alt="������ ������� ����" title="������ ������,�������,�������"></a>';
var file10='<a href="http://math.semestr.ru/simplex/simplex.php" target="_blank"><img src="http://www.semestr.ru/images/simplex468.gif" alt="��������-�����" title="��������-�����"></a>';
var file11='<a href="http://www.semestr.ru/ks330.html" target="_blank"><img src="http://www.semestr.ru/images/1308095.gif" alt="��� ������" title="��� ��"></a>';
var file12='<a href="http://www.semestr.ru/kurs.html" target="_blank"><img src="http://www.semestr.ru/images/1308097.gif" alt="�������������� ������ ��� �������� �����" title="�������������� ������ ��� �������� �����"></a>';
var file13='<a href="http://math.semestr.ru/cmo/cmo_manual.php" target="_blank"><img src="http://www.semestr.ru/images/cmo468.gif" alt="������� ��������� ������������ ������" title="������� ��������� ������������ ������"></a>';
var file14='<a href="http://math.semestr.ru/dinam/dinam_manual.php" target="_blank"><img src="http://www.semestr.ru/images/dinam468.gif" alt="������������ ���������������� ������" title="������������ ���������������� ������"></a>';
arr = new Array(file,file1,file2,file3,file4,file5,file6,file7,file8,file9,file10,file11,file12,file13,file14)
var RndNum = Math.round(Math.random() * 14);
if (RndNum>14) RndNum=14;
document.write(arr[RndNum]);