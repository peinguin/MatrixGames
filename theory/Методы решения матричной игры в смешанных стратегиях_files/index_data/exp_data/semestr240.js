var file='<a href="http://math.semestr.ru" target="_blank"><img src="http://www.semestr.ru/images/student2.gif" alt="������ ����������� � ��������� ������" title="������ ����������� � ��������� ������"></a>';
var file1='<a href="http://www.work5.ru?ref=1731&b=204" target="_blank"><img src="http://partners.work5.ru/img/saved/4/banners_b_204_240x400_work5_v1.gif" height="400" width="240" border=0></a>';
var file2='<a href="http://www.zaochnik.com?a_aid=1239&amp;a_bid=eca021ab" target="_blank"><img src="http://r-money.ru/pap/accounts/default1/banners/zao240x400.gif" alt="�������,��������,��������,�����������,�����������,������ �� �����" title="�������,��������,��������,�����������,�����������,������ �� �����" width="240" height="400" /></a><img style="border:0" src="http://r-money.ru/pap/scripts/imp.php?a_aid=1239&amp;a_bid=eca021ab" width="1" height="1" alt="" />';
var file1='<a href="http://axd.semestr.ru" target="_blank"><img src="http://www.semestr.ru/images/axd240.gif" alt="������ ������������� ������������" title="������ ������������� ������������"></a>';
var file2='<a href="http://math.semestr.ru" target="_blank"><img src="http://www.semestr.ru/images/math240.gif" alt="��������-�����" title="��������-�����"></a>';
var file3='<a href="http://www.semestr.ru/kurs.html" target="_blank"><img src="http://www.semestr.ru/images/1308096.gif" alt="�������������� ������ ��� �������� �����" title="�������������� ������ ��� �������� �����"></a>';
var file4='<a href="http://math.semestr.ru/math/diffur.php" target="_blank"><img src="http://www.semestr.ru/images/corel240.gif" alt="���������������� ��������� ������" title="���������������� ��������� ������"></a>';
var file5='<a href="http://math.semestr.ru/corel/corel_manual.php" target="_blank"><img src="http://www.semestr.ru/images/econometrika240.gif" alt="��������� ��������� ������" title="��������� ��������� ������"></a>';
var file6='<a href="http://math.semestr.ru/games/games_manual.php" target="_blank"><img src="http://www.semestr.ru/images/games240.gif" alt="������ ��� ������" title="������ ��� ������"></a>';
arr = new Array(file,file1,file2,file3,file4,file5,file6)
var RndNum = Math.round(Math.random() * 6);
if (RndNum>6) RndNum=6;
document.write(arr[RndNum]);