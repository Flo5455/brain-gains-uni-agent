// Eingebaute Karteikarten-Decks — werden mit der App ausgeliefert
import { RAW_PREISPOLITIK_TSV } from './preispolitikDeck.js';

const RAW_FLASHCARDS_TSV = String.raw`#separator:tab
#html:true
<b>Geschichtete Stichprobe</b>	Die Grundgesamtheit wird in Gruppen (Schichten) eingeteilt (z. B. nach Größe), und aus jeder Schicht wird zufällig gezogen	Lektion 1
<b>Einfache Zufallsstichprobe</b>	Jeder Merkmalsträger hat die <b>gleiche Chance</b>, ausgewählt zu werden (wie beim Lotto)	Lektion 1
<b>Klumpenstichprobe</b>	Man wählt zufällig bestehende Gruppen (Klumpen, z. B. Landkreise) aus und untersucht diese <b>vollständig</b>	Lektion 1
<b>Ad-hoc-Stichprobe</b>	Die Auswahl erfolgt rein nach <b>Verfügbarkeit</b> (z. B. Passanten in der Fußgängerzone), was wissenschaftlich wenig belastbar ist	Lektion 1
<b>Nominalskala</b>	Ausprägungen sind Namen oder Kategorien ohne Rangfolge (z. B. Geschlecht, Wohnort). Ein Sonderfall ist die <b>dichotome</b> Variable mit genau zwei Werten (z. B. Ja/Nein)	Lektion 1
<b>Ordinalskala</b>	Die Werte lassen sich in eine <b>sinnvolle Reihenfolge</b> bringen, aber die Abstände sind nicht interpretierbar (z. B. Schulnoten, Zufriedenheit)	Lektion 1
<b>Kardinalskala (metrisch)</b>	Hier sind die Ausprägungen Zahlen mit messbaren Abständen	Lektion 1
<b>Intervallskala</b>	Kein natürlicher Nullpunkt (z. B. Temperatur in Celsius)	Lektion 1
<b>Verhältnisskala</b>	Besitzt einen <b>natürlichen Nullpunkt</b> (z. B. Einkommen, Alter)	Lektion 1
<b>diskret</b>	abzählbar in 1er Schritten, z. B. Anzahl Kinder (ganzes Kind oder keines)	Lektion 1
<b>stetig</b>	unendlich viele Zwischenwerte, z. B. Gewicht	Lektion 1
<b>Querschnittsdesign</b>	einmalige Erhebung	Lektion 1
<b>Längsschnittdesign</b>	mehrfache Erhebung	Lektion 1
<b>Paneldesign (ist ein Längsschnittdesign)</b>	immer wieder dieselben Personen	Lektion 1
Trenddesign	immer andere zufällige Personen	Lektion 1
<b>Datenaufbereitung</b>	Die Daten werden bereinigt und in Software eingepflegt	Lektion 1
<b>deskriptive</b> Statistik	beschreiben/zusammenfassen	Lektion 1
<b>Inferenzstatistik</b>	verallgemeinern/Hypothesen prüfen	Lektion 1
<b>explorative</b> Statistik	neue Gebiete erforschen/ Erkenntnisse erlangen	Lektion 1
Ablauf statistischer Untersuchungen	1. <b>Datensammlung<br></b>2. <b>Datenaufbereitung<br></b>3. <b>Datenanalyse</b>	Lektion 1
<b>Grundgesamtheit</b>	Umfasst die Menge <b>aller</b> für die Studie relevanten Merkmalsträger	Lektion 1
<b>Stichprobe</b>	Umfasst die Teilmenge der <b>tatsächlich untersuchten</b> Merkmalsträger	Lektion 1
Definiere <b>Grundgesamtheit</b> und <b>Stichprobe</b>.	<div><b>Grundgesamtheit:</b> Umfasst die Menge <b>aller</b> für die Studie relevanten Merkmalsträger.</div><div><br></div><div><b>Stichprobe:</b> Umfasst die Teilmenge der <b>tatsächlich untersuchten</b> Merkmalsträger.</div>	Lektion 1
<b>Merkmal</b>	Die interessierende Eigenschaft (Variable) des Merkmalsträgers (z. B. Geschlecht, Bettenzahl)	Lektion 1
<b>Merkmalsausprägung</b>	"Ein konkreter beobachteter Wert/Zustand des Merkmals (z. B. ""weiblich"", ""20 Betten"")"	Lektion 1
Unterschied zwischen <b>Merkmal</b> und <b>Merkmalsausprägung</b>?	"<div><b>Merkmal:</b> Die interessierende Eigenschaft (Variable) des Merkmalsträgers (z. B. Geschlecht, Bettenzahl).</div><div> </div><div><b>Merkmalsausprägung:</b> Ein konkreter beobachteter Wert/Zustand des Merkmals (z. B. ""weiblich"", ""20 Betten"")</div>"	Lektion 1
Wie unterscheiden sich <b>Intervallskala</b> und <b>Verhältnisskala</b> innerhalb der Kardinalskala?	<div><b>Intervall:</b> <b>Kein natürlicher Nullpunkt</b> vorhanden (z. B. Temperatur in Grad Celsius).</div><div><b><br></b></div><div><b>Verhältnis:</b> Besitzt einen <b>natürlichen Nullpunkt</b>, die Null hat in allen Einheiten die gleiche Bedeutung (z. B. Guthaben, Alter).</div>	Lektion 1
Unterschied zwischen <b>diskreten</b> und <b>stetigen</b> Merkmalen?	<div><b>Diskret:</b> Endlich viele oder abzählbar unendlich viele Ausprägungen (durch Abzählen bestimmbar). Bsp: Personen im Haushalt.</div><div><b><br></b></div><div><b>Stetig:</b> Unendlich viele Ausprägungen; kann alle Werte eines Intervalls annehmen (Messung). Bsp: Ausgaben auf den Cent genau, Zeit</div>	Lektion 1
Unterschied: <b>Einfache Zufallsstichprobe</b> vs. <b>Geschichtete Stichprobe</b>?	<div><b>Einfache Zufallsstichprobe:</b> Jeder Merkmalsträger hat exakt die <b>gleiche Chance</b>, ausgewählt zu werden.</div><div><b><br></b></div><div><b>Geschichtete Stichprobe:</b> Aufteilung der Grundgesamtheit in relevante <b>Teilpopulationen (Schichten)</b>, danach Zufallsauswahl aus jeder Schicht</div>	Lektion 1
Definition: <b>Klumpen-</b> vs. <b>Ad-hoc-Stichprobe</b>?	<div><b>Klumpen:</b> Zufällige Auswahl <b>natürlich existierender Teilmengen</b> (Klumpen), die dann <b>vollständig</b> untersucht werden.</div><div><b><br></b></div><div><b>Ad-hoc:</b> Auswahl der Merkmalsträger nach <b>Verfügbarkeit</b> (willkürlich). Keine gute Grundlage für allgemeingültige Aussagen.</div>	Lektion 1
<b>Querschnitts-</b> vs. <b>Längsschnittdesign</b>?	<div><b>Querschnitt:</b> Erhebung zu <b>einem Zeitpunkt</b> oder in kurzer Zeitspanne.</div><div><b><br></b></div><div><b>Längsschnitt:</b> Erfassung derselben Daten zu <b>mehreren aufeinanderfolgenden Zeitpunkten</b>.</div>	Lektion 1
Unterschied zwischen <b>Trend-</b> und <b>Paneldesign</b>?	<div><b>Trend:</b> Regelmäßige Untersuchung, aber <b>nicht zwingend dieselben</b> Merkmalsträger.</div><div><b><br></b></div><div><b>Panel:</b> Immer wieder <b>dieselben</b> Merkmalsträger. Ermöglicht Beobachtung individueller Veränderungen über die Zeit. Höchster Informationsgehalt.</div>	Lektion 1
<b>Deskriptive</b> vs. <b>Inferenz-</b> vs. <b>Explorative Statistik</b>?	<b>Deskriptiv: </b>Beschreibung und Zusammenfassung gesammelter Daten (Tabellen, Maßzahlen). <br><br><div>I<b>nferenz:</b> Überprüfung der <b>Übertragbarkeit</b> von Stichprobenergebnissen auf die Allgemeinheit (Hypothesentests).</div><div><b><br></b></div><div><b>Explorativ:</b> Erkundung <b>neuer, wenig erforschter</b> Bereiche.</div>	Lektion 1
In welchem Verhältnis stehen Grundgesamtheit und Stichprobe zueinander?	Die Stichprobe sollte <b>repräsentativ</b> für die Grundgesamtheit sein, damit die Ergebnisse verallgemeinert werden können. Mit zunehmender Größe der Stichprobe werden die Aussagen über die Grundgesamtheit präziser.	Lektion 1
Welche Rechenoperation ist bei der Verhältnisskala erlaubt, bei der Intervallskala aber nicht?	Die Interpretation von <b>Verhältnissen</b> (z. B. „doppelt so viel“). Da die Intervallskala keinen echten Nullpunkt hat, machen solche Aussagen dort keinen Sinn.	Lektion 1
Warum gilt das Paneldesign als informativer als das Trenddesign?	Weil nur das Paneldesign die Beobachtung von <b>intraindividuellen Veränderungen</b> (Veränderungen innerhalb einer Person) ermöglicht.	Lektion 1
"Was ist die <b>absolute Häufigkeit (</b><span style=""font-style: italic;"">n</span><span style=""font-style: italic;"">j</span>​<b>)</b>?"	Sie gibt an, <b>wie oft</b> (als nackte Zahl) eine Merkmalsausprägung in einer Stichprobe gezählt wurde.	Lektion 2
"Was ist die <b>relative Häufigkeit (</b><span style=""font-style: italic;"">f</span><span style=""font-style: italic;"">j</span>​<b>)</b>?"	"Sie gibt den <b>Anteil</b> der Ausprägung an der Gesamtzahl (<span style=""font-style: italic;"">n</span>) wieder (<span style=""font-style: italic;"">f</span><span style=""font-style: italic;"">j</span>​=<span style=""font-style: italic;"">n</span><span style=""font-style: italic;"">j</span>​/<span style=""font-style: italic;"">n</span>). Sie liegt immer zwischen 0 und 1."	Lektion 2
Warum wird in Grafiken meist die relative statt der absoluten Häufigkeit dargestellt?	Weil sich aus den relativen Häufigkeiten die <b>Verhältnisse</b> in der Stichprobe besser ablesen und vergleichen lassen, unabhängig vom Stichprobenumfang.	Lektion 2
"Was ist der <b>Median (</b><span style=""font-style: italic;"">x</span><sub>0,5</sub>​<b>)</b>?"	Der Wert, der genau in der <b>Mitte</b> eines geordneten Datensatzes liegt. 50 % der Werte sind kleiner oder gleich, 50 % sind größer oder gleich.	Lektion 2
"Was ist der <b>Mittelwert (</b><span style=""font-style: italic;"">x</span>ˉ<b>)</b>?"	"Das <b>arithmetische Mittel</b> (Durchschnitt). Er berechnet sich aus der Summe aller Werte geteilt durch deren Anzahl (<span style=""font-style: italic;"">n</span>)."	Lektion 2
Wie unterscheiden sich Median und Mittelwert in Bezug auf Ausreißer?	Der Median ist <b>robust</b> gegenüber Ausreißern. Der Mittelwert hingegen ist <b>sehr ausreißerempfindlich</b> und wird von extremen Werten stark verzerrt.	Lektion 2
"Was ist die <b>Stichprobenvarianz (</b><span style=""font-style: italic;"">s</span><sup>2</sup><b>)</b>?"	Ein Streuungsmaß, das die durchschnittliche quadrierte Abweichung der Werte vom Mittelwert misst. Aufgrund der Quadrierung ist sie inhaltlich schwer interpretierbar.	Lektion 2
"<b>(Definition):</b> Was ist die <b>Standardabweichung (</b><span style=""font-style: italic;"">s</span><b>)</b>?"	Die <b>Wurzel aus der (Stichproben)Varianz</b>. Sie gibt die durchschnittliche Abweichung der Messwerte vom Mittelwert in der Originaleinheit an.	Lektion 2
Warum wird zur Interpretation meist die Standardabweichung und nicht die Varianz genutzt?	Weil die Standardabweichung die <b>gleiche Maßeinheit</b> wie die Originaldaten hat und somit direkt mit dem Mittelwert interpretiert werden kann („Mittelwert ± Standardabweichung“).	Lektion 2
Paneleffekte oder Lerneffekte	Es werden immer wieder die gleichen Antworten gegeben	Lektion 1
<div>Panelmortalitäten</div>	"<div>im Laufe der Zeit scheiden evtl. einige Krankenhäuser aus unterschiedlichen Gründen aus der Befragung aus</div>"	Lektion 1
<div>Univariate Analyse</div>	<div>Die univariate Analyse untersucht genau ein Merkmal.</div>	Lektion 2
<div>Bivariate Analyse</div>	<div>Die bivariate Analyse untersucht den Zusammenhang zwischen zwei Merkmalen.</div>	Lektion 3
Urliste/Rohdaten	x<sub>i</sub> = x<sub>1</sub>, x<sub>2</sub>, ..., x<sub>n ; i = 1, 2, ..., n</sub>	Lektion 2
Ausprägungsindex (i): (Formelzeichen für Merkmale) = 1, 2, (Formelzeichen Merkmalsausprägungen insgesamt)	a<sub>j</sub> mit j = 1, 2, ..., k	Lektion 2
<div>Absolute Häufigkeiten</div>	Die absoluten Häufigkeiten zählen das Vorkommen der einzelnen Merkmalsausprägungen ab	Lektion 2
Relative Häufigkeiten	Sie geben die Anteile der einzelnen Merkmalsausprägungen wieder.	Lektion 2
"Was ist die <b>absolute Häufigkeit (</b><span style=""font-style: italic;"">n</span><sub><span style=""font-style: italic;"">j</span></sub>​<b>)</b>?"	Sie gibt an, <b>wie oft</b> (als nackte Zahl) eine Merkmalsausprägung in einer Stichprobe gezählt wurde	Lektion 2
"Was ist die <b>relative Häufigkeit (</b><span style=""font-style: italic;"">f</span><sub><span style=""font-style: italic;"">j</span></sub>​<b>)</b>?"	"Sie gibt den <b>Anteil</b> der Ausprägung an der Gesamtzahl (<span style=""font-style: italic;"">n</span>) wieder (<span style=""font-style: italic;"">f</span><sub><span style=""font-style: italic;"">j</span>​</sub>=<span style=""font-style: italic;"">n</span><sub><span style=""font-style: italic;"">j</span>​</sub>/<span style=""font-style: italic;"">n</span>). Sie liegt immer zwischen 0 und 1"	Lektion 2
"Was ist der <b>Mittelwert (</b><span style=""font-style: italic;"">x (Strich über x)</span><b>)</b>?"	"Das <b>arithmetische Mittel</b> (Durchschnitt). Er berechnet sich aus der Summe aller Werte geteilt durch deren Anzahl (<span style=""font-style: italic;"">n</span>)"	Lektion 2
"Was ist die <b>Spannweite (</b><span style=""font-style: italic;"">R</span><b>)</b>?"	Das einfachste Streuungsmaß; es beschreibt den Gesamtabstand zwischen dem kleinsten und dem größten Wert eines Datensatzes.	Lektion 2
"Was ist der <b>Interquartilsabstand (</b><span style=""font-style: italic;"">I</span><span style=""font-style: italic;"">QR</span><b>)</b>?"	Ein Streuungsmaß, das die Differenz zwischen dem 75 %-Quartil und dem 25 %-Quartil misst und somit die Streuung der <b>zentralen 50 %</b> der Daten beschreibt.	Lektion 2
"Wie lauten die <b>Formeln</b> für <span style=""font-style: italic;"">R</span> und <span style=""font-style: italic;"">I</span><span style=""font-style: italic;"">QR</span> und welcher Wert ist robuster?"	"<div> <b>Spannweite:</b> <span style=""font-style: italic;"">R </span>= <span style=""font-style: italic;"">x</span><sub><span style=""font-style: italic;"">ma</span><span style=""font-style: italic;"">x</span></sub>​ − <span style=""font-style: italic;"">x</span><sub><span style=""font-style: italic;"">min</span></sub>​.</div><div><b>       IQR:</b> <span style=""font-style: italic;"">I</span><span style=""font-style: italic;"">QR </span>= <span style=""font-style: italic;"">x</span><sub>0,75 </sub>− <span style=""font-style: italic;"">x</span><sub>0,25</sub>​</div>"	Lektion 2
Wie berechnet man den <b>Mittelwert</b> aus einer Urliste vs. aus einer Häufigkeitstabelle?	"<div><b>Urliste:</b> <span style=""font-style: italic;"">x</span>ˉ(<sup>-</sup> über x) = <span style=""font-style: italic;"">n/</span>1 ​∑<span style=""font-style: italic;"">x</span><sub><span style=""font-style: italic;"">i</span></sub>​</div><div>    ▪ <b>Häufigkeitstabelle:</b> <span style=""font-style: italic;"">x</span>ˉ=∑(<span style=""font-style: italic;"">a</span><sub><span style=""font-style: italic;"">j</span>​</sub>⋅<span style=""font-style: italic;"">f</span><sub><span style=""font-style: italic;"">j</span>​</sub>)</div><div>    ▪ <b>Bei stetigen Daten:</b> <span style=""font-style: italic;"">x</span>ˉ=∑(<span style=""font-style: italic;"">m</span><sub><span style=""font-style: italic;"">j</span>​</sub>⋅<span style=""font-style: italic;"">f</span><sub><span style=""font-style: italic;"">j</span>​</sub>), wobei <span style=""font-style: italic;"">m</span><sub><span style=""font-style: italic;"">j</span></sub>​ die <b>Klassenmitte</b> ist.</div><br>"	Lektion 2
Was ist die <b>Kovarianz</b>?	Ein Maß für den linearen Zusammenhang zwischen zwei kardinalskalierten Variablen, das jedoch nicht normiert ist (Werte zwischen −∞ und +∞).	Lektion 4
"Was ist der <b>Korrelationskoeffizient nach Bravais-Pearson (</b><span style=""font-style: italic;"">r</span><sub><span style=""font-style: italic;"">x</span>,<span style=""font-style: italic;"">y</span></sub>​<b>)</b>?"	Ein auf den Bereich von <b>-1 bis +1</b> normiertes Maß für die Stärke und Richtung eines linearen Zusammenhangs.	Lektion 4
"Wie lautet die <b>Formel</b> für <span style=""font-style: italic;"">r</span><sub><span style=""font-style: italic;"">x</span>,<span style=""font-style: italic;"">y</span></sub>​ und wie hängt sie mit den Mittelwerten zusammen?"	"<img src=""paste-83f5a32f0e0e0dc4f1e6034af92ac9d97be231c5.jpg""> Dabei ist <i>xyˉ</i> (ˉ über <i>xy</i>)​ der Mittelwert der Produkte aus <i>x</i> und <i>y</i>. Der Zähler entspricht der Kovarianz."	Lektion 4
"Was ist der <b>Regressionskoeffizient (</b><span style=""font-style: italic;"">b</span><b>)</b>?"	"Er gibt die Steigung der Regressionsgeraden an und zeigt, um wie viele Einheiten sich <span style=""font-style: italic;"">y</span> verändert, wenn <span style=""font-style: italic;"">x</span> um eine Einheit steigt."	Lektion 4
"Was ist das <b>Bestimmtheitsmaß (</b><span style=""font-style: italic;"">R</span><sup>2</sup><b>)</b>?"	Es gibt an, welcher Anteil der Streuung der abhängigen Variablen durch die unabhängige Variable erklärt werden kann (Erklärungsgehalt).	Lektion 4
"Wie lauten die <b>Formeln</b> für <span style=""font-style: italic;"">b</span> und <span style=""font-style: italic;"">R</span><sup>2</sup>?"	"<div><img src=""paste-a67fa1d37e0b1b3570dfac5fc90f3bccc18dc54a.jpg""><img src=""paste-6ab2d328e69f018957c65695cbd71263201e1762.jpg""><br></div>"	Lektion 4
<div>Was ist der Modus?</div>	"<div>Der Modus (auch Modalwert genannt) ist diejenige Merkmalsausprägung eines Merkmals, die am häufigsten in der Stichprobe vorkommt. Die mathematische Abkürzung des Modus ist <b>x<sub>mod</sub></b>.</div><div><br></div><div>Ein Merkmal kann einen Modus oder mehrere Modi besitzen. Gibt es nur einen Modus, so spricht man von einer unimodalen Verteilung. Eine Verteilung mit zwei Modi bezeichnet man als bimodal und eine mit mehr als zwei Modi als multimodal.</div>"	Lektion 2
was sind die Einsatzmöglichkeiten für Lageparameter?	"<img src=""paste-b0d235cc51b973a92cb998620973b43265180a37.jpg"">"	Lektion 2
Wie berechnet man die Dichte einer Klasse?	"<div>Das Histogramm (auch empirische Dichtefunktion genannt) wird mit f x bezeichnet. Für das Zeichnen des Histogramms werden auf der x-Achse die Klassengrenzen abgetragen. Auf der y-Achse werden nicht die relativen Häufigkeiten, sondern die sog. Dichten berücksichtigt. Diese müssen zunächst durch f<sub>j</sub>/Δ<sub>j </sub>für Klasse <sub>j</sub> berechnet werden, wobei Δ<sub>j</sub> (Delta) die Klassenbreite ist. Die Dichte muss für alle Klassen erechnet werden und wird dann an der Y-Achse abgetragen.</div>"	Lektion 2
<div>Quantile</div>	<div>Ein Quantil wird durch eine Ausprägung bestimmt, die von p % der Merkmalsträger nicht überschritten wird.</div>	Lektion 2
Wie berechnet man ein Quantil?	<div>n· p -> 11(n) · 0,4(p) = 4,4 (keine ganze Zahl) -> = 5</div><div>n· p -> 10(n) · 0,5(p) = 5 (ganze Zahl) -> x<sub>5</sub> + x<sub>6</sub> / 2 = x<sub>0,5(p)</sub> (Quantil) (Mitte zwischen 5.er und 6.er Merkmalsausprägung)</div>	Lektion 2
Wie wird ein Quantil von x0,5 für ein stetig-kardinalskaliertes Merkmal mit einer Häufigkeitstabelle berechnet?	"<div>Für die Berechnung beginnen wir mit der 45 als Untergrenze. Dazu wird ein gewisser Teil hinzuaddiert: </div><div><br></div><div>Der Zähler des Bruches startet mit dem durch den Median vorgegebenen Anteil in Höhe von 0,5. Abgezogen davon wird die kumulierte Häufigkeit der vorherigen Klasse mit 9/19 . Geteilt wird durch die relative Häufigkeit der relevanten Klasse; hier 6/19. </div><div><br></div><div>Und schließlich wird mit der Breiten der Klasse in Höhe von 5 (50 - 45) multipliziert: </div><div><br></div><div><img src=""paste-1630bd979dee13c39797532850b06b85c2640091.jpg""><br></div>"	Lektion 2
Wie berechne ich den Durchschnitt bei einem diskret-kardinalskaliertem Merkmal nur mit der Häufigkeitstabelle?	"<img src=""paste-678aecab25d6f178551cc19141b86532bb863d6c.jpg"">"	Lektion 2
Lagemaßverteilung (Mittelwert vs. Median)	"<img src=""paste-04689f76c9cfcaab98c00c87d0dbf2895f591f47.jpg"">"	Lektion 2
Spannweite R	"<img src=""paste-ae11ccbed88149a792ad026d26b7297db5679c48.jpg""> größte Ausprägung - kleinste Ausprägung"	Lektion 2
<div>Interquartilsabstand</div>	"<div>Der Interquartilsabstand zeigt den Abstand der zentralen 50 % an Merkmalsträgern.</div>"	Lektion 2
Was passiert mit s<sup>2</sup> und s wenn alle Grundwerte mit dem Wert a (z.B. 2) addiert werden?	Dies tangiert s<sup>2</sup> und s gar nicht, da die Abstände zwischen den Werten ja gleich bleiben.	Lektion 2
Was passiert mit s<sup>2</sup> und s wenn alle Grundwerte mit dem Wert b (z.B. 2) multipliziert werden?	"<div>Eine Multiplikation aller Werte mit b führt zu einer Veränderung der Stichprobenvarianz um b<sup>2</sup> und der Standardabweichung um exakt b.</div><div><img src=""paste-ad0af58cf983457d999f8028e9b6790d67588497.jpg""><br></div>"	Lektion 2
Was ist eine <b>Kontingenztabelle</b>?	"Eine Tabelle zur Darstellung der gemeinsamen Häufigkeitsverteilung zweier nominalskalierter Merkmale. Im Zentrum stehen die gemeinsamen absoluten Häufigkeiten (<span style=""font-style: italic;"">n</span><span style=""font-style: italic;"">ij</span>​), an den Rändern die Zeilen- und Spaltensummen (Randhäufigkeiten).<br><br><img src=""paste-c77e662d701523ab0a666be50fdfd1450eedb928.jpg"">"	Lektion 3
"Was sind <b>erwartete Häufigkeiten (</b><span style=""font-style: italic;"">n</span><span style=""font-style: italic;"">ij</span>∗​<b>)</b>?"	"Das sind die theoretischen Häufigkeiten, die man erwarten würde, wenn <b>kein Zusammenhang</b> (Unabhängigkeit) zwischen den Merkmalen bestünde. Sie berechnen sich aus dem Produkt der Randhäufigkeiten geteilt durch die Gesamtanzahl <span style=""font-style: italic;"">n</span>.<br>+<br><img src=""paste-54c71b6a28576a93f655e2eb3ddfd32a8c5d1bcc.jpg"">"	Lektion 3
"Was ist <b>Chi-Quadrat (</b><span style=""font-style: italic;"">χ</span>2<b>)</b>?"	"Ein Maß für die Abweichung zwischen den <i>beobachteten</i> und den <i>erwarteten</i> Häufigkeiten. Je größer <span style=""font-style: italic;"">χ</span><sup>2</sup>, desto stärker der Zusammenhang. Da <span style=""font-style: italic;"">χ</span><sup>2</sup> aber nicht normiert ist (es wächst mit <span style=""font-style: italic;"">n</span>), ist es allein schwer zu interpretieren."	Lektion 3
"Warum benötigt man den <b>korrigierten Kontingenzkoeffizienten (</b><span style=""font-style: italic;"">K</span><sup>∗</sup><b>)</b> und nicht nur <span style=""font-style: italic;"">χ</span><sup>2</sup> oder <span style=""font-style: italic;"">K</span>?"	"<div><br>   ▪ <span style=""font-style: italic;"">χ</span>2 ist abhängig von der Stichprobengröße und nicht normiert.</div><div>    ▪ Der normale Kontingenzkoeffizient <span style=""font-style: italic;"">K</span> liegt immer unter 1 (erreicht nie das Maximum).</div><div>    ▪ Erst der <b>korrigierte Koeffizient </b><span style=""font-style: italic;"">K</span>∗ normiert den Wert auf den Bereich <b>0 bis 1</b>, was die Interpretation der Stärke </div><div>     des Zusammenhangs ermöglicht (0 = kein, 1 = perfekter Zusammenhang).</div>"	Lektion 3
Welche Schritte werden bei der Kontingenzanalyse durchlaufen?	"<b>Schritt 1: Berechnung der erwarteten Häufigkeiten<br></b><b>Formel:</b> Man multipliziert die Zeilensumme (<span style=""font-style: italic;"">n</span><sub><span style=""font-style: italic;"">i</span>.</sub>​) mit der Spaltensumme (<span style=""font-style: italic;"">n</span><sub>.<span style=""font-style: italic;"">j</span>​</sub>) und teilt durch die Gesamtzahl (<span style=""font-style: italic;"">n</span>):<br><img src=""paste-c1b8289f0a53da6bf489b88adc8cca06d640cc33.jpg""><br><br><b>Schritt 2: Berechnung von Chi-Quadrat (</b><span style=""font-style: italic;"">χ</span><sup>2</sup><b>)<br></b>Man misst den Abstand zwischen den <i>tatsächlich beobachteten</i> Häufigkeiten (<span style=""font-style: italic;"">n</span><sub><span style=""font-style: italic;"">ij</span></sub>​) und den <i>erwarteten</i> Häufigkeiten (<span style=""font-style: italic;"">n</span><sup>~</sup><sub><span style=""font-style: italic;"">ij</span></sub>​). Die Differenzen werden quadriert (damit sich Plus und Minus nicht aufheben), durch die erwartete Häufigkeit geteilt und aufsummiert.<br><b>Formel:<br></b><img src=""paste-8686b11aeb5f6869123301cae4b810c63bf4bcac.jpg""><br><b><br></b><b>Schritt 3: Berechnung des Kontingenzkoeffizienten (</b><span style=""font-style: italic;"">K</span><b>)<br></b>Da <span style=""font-style: italic;"">χ</span>2 von der Stichprobengröße <span style=""font-style: italic;"">n</span> abhängt und nach oben offen ist (nicht normiert), ist der Wert schwer zu interpretieren. Deshalb berechnet man <span style=""font-style: italic;"">K</span>, der Werte zwischen 0 und <1 annimmt.<br><b>Formel:<br></b><img src=""paste-e05004924a18ae59f8cac03e95e2b37c8bfdf2ea.jpg""><br><b><br></b><b>Schritt 4: Berechnung des korrigierten Kontingenzkoeffizienten (</b><span style=""font-style: italic;"">K</span>∗<b>)<br></b><div>Der normale Koeffizient <span style=""font-style: italic;"">K</span> kann den Wert 1 (perfekter Zusammenhang) nie erreichen. Sein Maximum (<span style=""font-style: italic;"">K</span><sub><span style=""font-style: italic;"">ma</span><span style=""font-style: italic;"">x</span></sub>​) hängt von der Größe der Tabelle ab. Um eine Skala von 0 bis 1 zu erhalten, wird <span style=""font-style: italic;"">K</span> korrigiert.</div><div><b>Formel:</b></div><img src=""paste-b1db9e95e34c1194afb3af8eb1f8a5c401ccb0ac.jpg""><br><div>Die Funktion min ist dabei eine Minimumfunktion und wählt die kleinere Zahl der Spalten- bzw. Zeilenanzahl. Daraus ergibt sich M, welches für das sog. K<sub>max</sub> und das schließlich zur Berechnung von K<sup>*</sup> herangezogen wird.</div>"	Lektion 3
Wie müssen die Merkmale skaliert sein damit die Kontigenzanalyse zum Einsatz kommt?	Nominalskaliert	Lektion 3
Wie wird die Variable bezeichnet, die in einer Regressionsanalyse die Einflussnahme ausübt?	Unabhängige Variable (oder Prädiktor).	Lektion 4
Wie wird die Variable bezeichnet, die in einer Regressionsanalyse von einer anderen Variable beeinflusst wird?	Abhängige Variable (oder Kriterium).	Lektion 4
Welches Skalenniveau müssen Merkmale mindestens aufweisen, um für eine einfache lineare Regression geeignet zu sein?	Kardinalskala.	Lektion 4
Wie nennt man das statistische Verfahren, wenn der Einfluss mehrerer unabhängiger Variablen auf eine abhängige Variable untersucht wird?	Multiple lineare Regression.	Lektion 4
"Auf welcher Achse eines Streudiagramms wird die unabhängige Variable <span style=""font-style: italic;"">X</span> standardmäßig abgetragen?"	x-Achse.	Lektion 4
Wie lautet die allgemeine mathematische Funktionsgleichung einer linearen Regressionsgeraden?	y = a + b(x)	Lektion 4
"Welchen geometrischen Bestandteil der Regressionsgeraden beschreibt der Parameter <span style=""font-style: italic;"">a</span>?"	Den y-Achsenabschnitt (Regressionskonstante).	Lektion 4
"Welche Eigenschaft der Regressionsgeraden wird durch den Parameter <span style=""font-style: italic;"">b</span> definiert?"	Die Steigung (Regressionskoeffizient).	Lektion 4
Welches statistische Prinzip minimiert die Summe der quadrierten Abstände zwischen den Beobachtungspunkten und der Geraden?	Methode der kleinsten Quadrate.	Lektion 4
Term: Residuum	Definition: Der Abstand zwischen einem tatsächlichen \(y\)-Wert und dem auf Basis der Regressionsgeraden geschätzten \(\hat{y}\)-Wert.	Lektion 4
"Welches Symbol wird in der Statistik über einer Variablen (z. B. <span style=""font-style: italic;"">y</span>^​) genutzt, um eine Schätzung zu kennzeichnen?"	Ein Dach (Zirkumflex).	Lektion 4
"Welcher Koeffizient der Regressionsgleichung (<span style=""font-style: italic;"">a</span> oder <span style=""font-style: italic;"">b</span>) muss mathematisch zwingend zuerst berechnet werden?"	"Der Regressionskoeffizient <span style=""font-style: italic;"">b</span>."	Lektion 4
"Formel: Regressionskoeffizient <span style=""font-style: italic;"">b</span> (basierend auf Mittelwerten)"	"<img src=""paste-38cca99ec4f114e0b27ad806a63b14e9cd851b17.jpg"">"	Lektion 4
"Was gibt der Regressionskoeffizient <span style=""font-style: italic;"">b</span> inhaltlich über den Zusammenhang der Variablen an?"	"Um wie viele Einheiten sich <span style=""font-style: italic;"">y</span> verändert, wenn <span style=""font-style: italic;"">x</span> um genau eine Einheit zunimmt."	Lektion 4
"Was beschreibt die Regressionskonstante <span style=""font-style: italic;"">a</span> in einem inhaltlichen Kontext?"	"Den zu erwartenden Wert von <span style=""font-style: italic;"">y</span>, wenn die unabhängige Variable <span style=""font-style: italic;"">x</span> den Wert 0 hat."	Lektion 4
"Wie wird ein negativer Regressionskoeffizient (<span style=""font-style: italic;"">b</span><0) grafisch im Streudiagramm dargestellt?"	Durch eine fallende Gerade (von links oben nach rechts unten).	Lektion 4
Nenne die drei Maße zur Beurteilung der Qualität (Modellgüte) einer linearen Regressionsgeraden.	Korrelationskoeffizient von Bravais-Pearson, Bestimmtheitsmaß und Standardfehler.	Lektion 4
Auf welcher Achse eines Streudiagramms wird die unabhängige Variable X standardmäßig abgetragen?	x-Achse.	Lektion 4
Welchen geometrischen Bestandteil der Regressionsgeraden beschreibt der Parameter \(a\)?	Den y-Achsenabschnitt (Regressionskonstante).	Lektion 4
Welche Eigenschaft der Regressionsgeraden wird durch den Parameter \(b\) definiert?	Die Steigung (Regressionskoeffizient).	Lektion 4
Welches Symbol wird in der Statistik über einer Variablen (z. B. \(\hat{y}\)) genutzt, um eine Schätzung zu kennzeichnen?	Ein Dach (Zirkumflex).	Lektion 4
Warum müssen die Abweichungen (Residuen) bei der Bestimmung der Regressionsgerade quadriert werden?	Damit sich positive und negative Abweichungen nicht gegenseitig zu Null aufsummieren.	Lektion 4
Welcher Koeffizient der Regressionsgleichung (\(a\) oder \(b\)) muss mathematisch zwingend zuerst berechnet werden?	Der Regressionskoeffizient \(b\).	Lektion 4
Formel: Regressionskoeffizient \(b\) (basierend auf Mittelwerten)	\(b = \frac{\bar{xy} - \bar{x} \cdot \bar{y}}{\bar{x^2} - \bar{x}^2}\)	Lektion 4
Formel: Regressionskonstante a	a = y - b(x)	Lektion 4
Was gibt der Regressionskoeffizient \(b\) inhaltlich über den Zusammenhang der Variablen an?	Um wie viele Einheiten sich \(y\) verändert, wenn \(x\) um genau eine Einheit zunimmt.	Lektion 4
Was beschreibt die Regressionskonstante \(a\) in einem inhaltlichen Kontext?	Den zu erwartenden Wert von \(y\), wenn die unabhängige Variable \(x\) den Wert \(0\) hat.	Lektion 4
Wie wird ein negativer Regressionskoeffizient (b < 0) grafisch im Streudiagramm dargestellt?	Durch eine fallende Gerade (von links oben nach rechts unten).	Lektion 4
Welchen Mindestwert sollte der Betrag des Korrelationskoeffizienten \(|r_{x,y}|\) für eine sinnvolle Regressionsprognose erreichen?	Mindestens 0,5.	Lektion 4
Definition: Bestimmtheitsmaß R^2	Der Anteil der Streuung der abhängigen Variablen, der durch die unabhängige Variable erklärt werden kann.	Lektion 4
In welchem Wertebereich bewegt sich das Bestimmtheitsmaß R<sup>2</sup>?	Zwischen 0 und 1 (bzw. 0% und 100%).	Lektion 4
Wie lässt sich das Bestimmtheitsmaß R^2 auf einfachstem Weg aus dem Korrelationskoeffizienten r_{x,y} berechnen?	R^2 = r_{x,y}^2	Lektion 4
Was bedeutet ein Bestimmtheitsmaß von \(R^2 = 1\) für die Anordnung der Datenpunkte im Streudiagramm?	Alle Punkte liegen perfekt auf einer Geraden.	Lektion 4
Ab welcher Höhe gilt ein Bestimmtheitsmaß R<sup>2</sup> in der praktischen Anwendung meist als zufriedenstellend?	Ab 0,3 (bzw. 30%).	Lektion 4
Was beschreibt der Standardfehler \(\sigma_{x,y}\) im Rahmen der Regressionsanalyse?	Den durchschnittlichen Fehler, den man bei der Nutzung des Regressionsmodells für Prognosen begeht.	Lektion 4
In welcher Maßeinheit wird der absolute Standardfehler sigma<sub>x,y</sub> angegeben?	In der Maßeinheit der abhängigen Variablen Y.	Lektion 4
Formel: Relativer Standardfehler sigma<sub>o</sub>	sigma<sub>0</sub> = sigma<sub>x,y</sub> / y (quer)	Lektion 4
Warum ist der relative Standardfehler oft aussagekräftiger als der absolute Standardfehler?	Er drückt die durchschnittliche Abweichung als Prozentzahl aus und ist somit unabhängig von der Skalierung interpretierbar.	Lektion 4
Wie verhalten sich Korrelation, Bestimmtheitsmaß und Standardfehler bei einer hoher Modellgüte zueinander?	Hohe Korrelation führt zu hohem Bestimmtheitsmaß und niedrigem Standardfehler.	Lektion 4
Die Gesamtstreuung der abhängigen Variablen setzt sich zusammen aus der erklärten Streuung und der _____.	Nicht erklärten Streuung.	Lektion 4
"Welche Faktoren können zur 'nicht erklärten Streuung' in einem Regressionsmodell beitragen?"	Nicht berücksichtigte Variablen oder Messfehler.	Lektion 4
Wie wird eine Prognose für einen beliebigen Wert x konkret durchgeführt?	Der Wert x wird in die geschätzte Regressionsgleichung y^ = a + b(x) eingesetzt.	Lektion 4
Was ist die Kernvoraussetzung für die Wirkungsrichtung zwischen \(X\) und \(Y\) in der Regression?	Es muss ein begründeter Verdacht vorliegen, dass \(X\) die Variable \(Y\) beeinflusst und nicht umgekehrt.	Lektion 4
Welcher mathematische Zusammenhang besteht zwischen dem Vorzeichen von \(b\) und dem Vorzeichen von \(r_{x,y}\)?	Sie besitzen immer das gleiche Vorzeichen (beide positiv oder beide negativ).	Lektion 4
"Was bedeutet ein Regressionskoeffizient von \(b = 53,844\) im Beispiel 'Alkoholkonzentration (\(x\)) und Reaktionszeit (\(y\))'?"	Pro \(1\) Promille Steigerung erhöht sich die Reaktionszeit im Durchschnitt um \(53,844\) Millisekunden.	Lektion 4
Was zeigt das Bestimmtheitsmaß \(R^2\) an?	Wie gut die unabhängige Variable die abhängige Variable erklärt.	Lektion 4
Wie berechnet man den Mittelwert x^2(quer), der für den Nenner von b$benötigt wird?	Alle einzelnen x-Werte werden quadriert, aufsummiert und durch die Anzahl der Beobachtungen n geteilt.	Lektion 4
In welcher statistischen Disziplin (Deskriptiv, Explorativ oder Inferenz) bewegen wir uns bei der Bestimmung einer Regressionsgeraden für einen vorliegenden Datensatz?	Deskriptive Statistik.	Lektion 4
Ein Modell ergibt \(R^2 = 0,72\). Welcher Prozentsatz der Streuung bleibt durch andere Faktoren ungeklärt?	\(28\%\).	Lektion 4
Wahr oder Falsch: Die Methode der kleinsten Quadrate findet für jeden beliebigen Datensatz eine Gerade, unabhängig von dessen Qualität.	Wahr.	Lektion 4
"Was beschreibt der Begriff 'Prädiktor' in der Regressionsrechnung?"	Die unabhängige Variable (\(X\)).	Lektion 4
Welcher Wert für \(R^2\) resultiert, wenn der Korrelationskoeffizient \(r_{x,y} = 0\) ist?	\(0\) (Die unabhängige Variable hat keinen Erklärungsgehalt).	Lektion 4
Wie wird der absolute Standardfehler interpretiert, wenn sigma_{x,y} = 43,28 Millisekunden beträgt?	Bei Prognosen weicht man im Durchschnitt um 43,28 Millisekunden vom wahren Wert ab.	Lektion 4
Was ist das Ziel der bivariaten Analyse im Kontext der Regression?	Die Untersuchung der Abhängigkeitsstruktur zwischen zwei Merkmalen (\(X \rightarrow Y\)).	Lektion 4
Warum ist die grafische Darstellung (Streudiagramm) vor der Berechnung der Regression wichtig?	Um optisch zu prüfen, ob der Zusammenhang zwischen den Variablen näherungsweise linear ist.	Lektion 4
Welcher Parameter der Geradengleichung gibt den Startpunkt der Geraden auf der vertikalen Achse an?	Die Regressionskonstante \(a\).	Lektion 4
Berechnung: Wenn y^ = 660, b = 50 und x = 1,2, wie groß ist a?	a = 660 - (50 \ 1,2) = 600.	Lektion 4
Wie verändert sich die Steigung der Regressionsgeraden, wenn der Regressionskoeffizient \(b\) größer wird?	Die Gerade verläuft steiler.	Lektion 4
"Was bedeutet ein 'vollständiger Erklärungsgehalt' in der Regressionsanalyse?"	Die unabhängige Variable erklärt die Streuung der abhängigen Variable zu \(100\%\) (\(R^2 = 1\)).	Lektion 4
Wie definiert man einen Vorgang dessen Ausgang im Voraus nicht exakt bekannt ist und vom Zufall abhängt?	Zufallsexperiment (oder Zufallsvorgang)	Lektion 5
Wie wird die Menge aller möglichen Ergebnisse eines Zufallsexperiments bezeichnet?	Ergebnismenge (oder Ergebnisraum) Ω	Lektion 5
Geben Sie die Ergebnismenge (Ω) für den einmaligen Wurf eines sechsseitigen Würfels an.	Ω = {1; 2; 3; 4; 5; 6}	Lektion 5
Term/Definition: Ereignis	Eine Teilmenge der Ergebnismenge die jene Ergebnisse beinhaltet für die man sich interessiert.	Lektion 5
Wie bezeichnet man ein Ereignis das alle Elemente der Ergebnismenge umfasst und somit immer eintritt?	Sicheres Ereignis	Lektion 5
Ein Ereignis das niemals eintreten kann (z. B. eine 7 mit einem sechsseitigen Würfel werfen) heißt _____.	unmögliches Ereignis	Lektion 5
Was versteht man unter einem Elementarereignis?	Jedes einzelne unteilbare Ergebnis der Ergebnismenge.	Lektion 5
Wie wird das Ereignis genannt das genau dann eintritt wenn das Ereignis A nicht eintritt?	Komplementärereignis (oder Gegenereignis)	Lektion 5
Welches grafische Hilfsmittel dient der Veranschaulichung von Ereignisoperationen durch Kreise in einem Kasten?	Venn-Diagramm	Lektion 5
Wie lautet die Mengenoperation (A ∪ B) in Worten?	A vereinigt mit B (Ereignis A oder Ereignis B oder beide treten ein).	Lektion 5
Welche Mengenoperation beschreibt das gleichzeitige Eintreten zweier Ereignisse A und B?	Durchschnittsmenge (A ∩ B)	Lektion 5
Wie nennt man zwei Ereignisse die keine gemeinsamen Ergebnisse haben und deren Schnittmenge die leere Menge ist?	Disjunkte (oder unvereinbare) Ereignisse	Lektion 5
Was beschreibt die Differenz A \ B (gelesen als "A ohne B")?	Das Eintreten von Ereignis A, unter der Bedingung, dass B nicht eintritt.	Lektion 5
Berechnung: Wie bestimmt man die Wahrscheinlichkeit P(A) nach Laplace wenn alle Ergebnisse gleich wahrscheinlich sind?	P(A) = {Anzahl der günstigen Ergebnisse in A} / (durch) {Anzahl der möglichen Ergebnisse in Ω}	Lektion 5
Die Wahrscheinlichkeit für jedes beliebige Ereignis A muss stets >= _____ sein.	0	Lektion 5
Wie hoch ist die maximale Wahrscheinlichkeit die ein Ereignis annehmen kann?	1 (oder 100 \%)	Lektion 5
Wenn zwei Ereignisse A und B disjunkt sind wie berechnet man dann P(A ∪ B)?	P(A ∪ B) = P(A) + P(B)	Lektion 5
Wie berechnet man die Wahrscheinlichkeit der Durchschnittsmenge P(A ∩ B) wenn A und B unabhängig sind?	P(A ∩ B) = P(A) * P(B)	Lektion 5
Variablen deren Ausgänge vom Zufall abhängen nennt man _____.	Zufallsvariablen	Lektion 6
Was charakterisiert eine diskrete Zufallsvariable im Gegensatz zu einer stetigen?	Sie besitzt eine abzählbare Menge an verschiedenen Ausprägungen.	Lektion 6
Wie nennt man die Funktion f X(x) welche die Wahrscheinlichkeit für jede einzelne Ausprägung einer diskreten Zufallsvariable angibt?	Wahrscheinlichkeitsfunktion	Lektion 6
Welche Bedingung muss die Summe aller Wahrscheinlichkeiten einer Wahrscheinlichkeitsfunktion erfüllen?	Die Summe muss exakt 1 ergeben.	Lektion 6
Welches Diagramm wird üblicherweise zur grafischen Darstellung einer Wahrscheinlichkeitsfunktion verwendet?	Balkendiagramm	Lektion 6
Wie berechnet man den Erwartungswert μ einer diskreten Zufallsvariable X?	μ = E(X) = ∑ x * fX(x)	Lektion 6
Warum spricht man bei Zufallsvariablen von einem Erwartungswert und nicht von einem Mittelwert?	Weil Ergebnisse aufgrund von Ungewissheit nur erwartet werden können während Mittelwerte auf konkreten Beobachtungen basieren.	Lektion 6
Geben Sie die Formel für die Varianz σ^2 einer Zufallsvariable unter Verwendung von Erwartungswerten an.	σ^2 = Var(X) = E(X^2) - [E(X)]^2	Lektion 6
Wie erhält man die Standardabweichung σ aus der Varianz?	Durch Ziehen der Quadratwurzel aus der Varianz (σ = √σ^2).	Lektion 6
Was gibt die Standardabweichung im Kontext einer Zufallsvariable an?	Die erwartete Abweichung vom Erwartungswert.	Lektion 6
Welche Funktion tritt bei stetigen Zufallsvariablen an die Stelle der Wahrscheinlichkeitsfunktion?	Dichtefunktion fX(x)	Lektion 6
Wie wird die Wahrscheinlichkeit in einem bestimmten Intervall bei einer stetigen Zufallsvariable grafisch ermittelt?	Durch die Fläche unter der Dichtefunktion innerhalb dieses Intervalls.	Lektion 6
Warum ist die Wahrscheinlichkeit für eine exakte Ausprägung (Punktwahrscheinlichkeit) bei stetigen Zufallsvariablen fast Null?	Weil es unendlich viele mögliche Ausprägungen gibt und nur Intervalle Flächen (Wahrscheinlichkeiten) bilden.	Lektion 6
Wie bezeichnet man eine Verteilung die über den gesamten Ausprägungsbereich die gleiche Dichte aufweist?	Gleichverteilung (oder Rechteckverteilung)	Lektion 6
Wie nennt man einen Zufallsvorgang mit genau zwei möglichen Ausgängen (Erfolg/Misserfolg)?	Bernoullivorgang	Lektion 6
Welche diskrete Verteilung zählt die Anzahl der Erfolge in einer festen Anzahl n von unabhängigen Bernoullivorgängen?	Binomialverteilung	Lektion 6
Wie lautet der Erwartungswert E(X) einer binomialverteilten Zufallsvariable?	E(X) = n * p	Lektion 6
Formel: Varianz einer binomialverteilten Zufallsvariable	Var(X) = n * p * (1 - p)	Lektion 6
Welche diskrete Verteilung beschreibt die Anzahl der Misserfolge bis zum ersten Eintreten eines Erfolgs?	Geometrische Verteilung	Lektion 6
Wie lautet die Wahrscheinlichkeitsfunktion der geometrischen Verteilung für x Misserfolge?	P(X = x) = p * (1 - p)<sup>x</sup>	Lektion 6
Was gibt der Erwartungswert E(X) = {1 - p ) / p bei einer geometrischen Verteilung an?	Die erwartete Anzahl an Misserfolgen vor dem ersten Erfolg.	Lektion 6
Wie nennt man die wichtigste stetige Verteilung deren Dichtefunktion symmetrisch um den Erwartungswert verläuft?	Normalverteilung	Lektion 6
Welches Merkmal der Normalverteilung bestimmt wie steil oder flach die Dichtefunktion abfällt?	Die Varianz (bzw. die Standardabweichung σ).	Lektion 6
Welchen Wert hat die gesamte Fläche unter der Dichtefunktion einer Normalverteilung?	1 (bzw. 100 %)	Lektion 6
Wie nennt man den Prozess eine normalverteilte Variable X in eine standardnormalverteilte Variable Z umzurechnen?	Standardisierung	Lektion 6
Geben Sie die Formel zur Berechnung des Z-Wertes an.	Z = (x−μ) \ σ	Lektion 6
Welche Verteilung wird genutzt wenn ein Konfidenzintervall für den Mittelwert bei unbekannter Varianz der Grundgesamtheit aufgestellt werden soll?	t-Verteilung	Lektion 6
Was ist der entscheidende Unterschied zwischen der t-Verteilung und der Standardnormalverteilung?	Die t-Verteilung berücksichtigt zusätzlich den Stichprobenumfang.	Lektion 6
Cloze: Die Wahrscheinlichkeit P(X >= x) bei einer stetigen Verteilung entspricht 1 - ...	P(X < x) (oder FX(x))	Lektion 6
In welcher Phase der Statistik bewegt man sich wenn man neue kaum erforschte Phänomene (z. B. eine neue Ansteckungsrate) untersucht?	Explorative Statistik	Lektion 1
Welche Verteilung wird für ein Konfidenzintervall des Erwartungswerts verwendet wenn die Varianz σ^2 der Grundgesamtheit bekannt ist?	Standardnormalverteilung	Lektion 6
Berechnung: Wenn P(A) = 0;8 und P(B) = 0;7 bei Unabhängigkeit wie groß ist P(A ∩ B)?	0;56 (0;8 * 0;7)	Lektion 5
Welche Form nimmt die Dichtefunktion einer Normalverteilung grafisch an?	Glockenform (Gaußsche Glockenkurve)	Lektion 6
Wo befindet sich der höchste Punkt der Dichtefunktion bei einer Normalverteilung?	An der Stelle des Erwartungswerts μ.	Lektion 6
Wie lautet der Fachbegriff für die durchschnittliche Abweichung vom Erwartungswert?	Standardabweichung	Lektion 6
Concept: P(X = x) bei stetigen Variablen	Diese Wahrscheinlichkeit ist Null da nur Intervalle eine Fläche unter der Dichte besitzen.	Lektion 6
Was ist der Träger TX einer Zufallsvariable?	Die Menge aller Werte, die die Zufallsvariable annehmen kann.	Lektion 6
Welche Verteilung liegt vor wenn man fragt: "Wie viele Prüfungsfragen muss ich raten bis die erste Antwort richtig ist?"	Geometrische Verteilung	Lektion 6
Was ist eine Intervallschätzung?	Die Angabe eines Bereichs (Konfidenzintervall) in dem der wahre Parameter der Grundgesamtheit mit einer gewissen Wahrscheinlichkeit liegt.	Lektion 6
Wenn die t-Verteilung genutzt wird welcher Parameter der Stichprobe beeinflusst die Form der Verteilung maßgeblich?	Der Stichprobenumfang n (bzw. die Freiheitsgrade).	Lektion 6
Beispiel: Postleitzahlen werden auf welchem Skalenniveau gemessen?	Nominalskala	Lektion 1
Wie verhält sich die Dichtefunktion einer Normalverteilung bei einer sehr kleinen Varianz?	Sie fällt vom höchsten Punkt aus sehr steil ab.	Lektion 6
Was bedeutet "Erwartungstreue" eines Schätzers?	Dass der Schätzer im Durchschnitt dem wahren Parameter der Grundgesamtheit entspricht.	Lektion 6
Wie lautet die Summe der relativen Häufigkeiten in der deskriptiven Statistik im Vergleich zur Summe der Wahrscheinlichkeiten in der Wahrscheinlichkeitsrechnung?	Beide müssen 1 (bzw. 100 \%) ergeben.	Lektion 2
In einem Venn-Diagramm: Wo liegt die Schnittmenge zweier Ereignisse A und B?	Dort, wo sich die beiden Kreise überlappen.	Lektion 5
Was ist das Ergebnis der Schnittmenge zweier disjunkter Ereignisse?	Die leere Menge ∅.	Lektion 5
Wie nennt man die grafische Darstellung bei der die Fläche eines Rechtecks (Höhe * Breite) die Wahrscheinlichkeit angibt?	Histogramm (oder Darstellung der Dichtefunktion einer Gleichverteilung)	Lektion 6
Wenn P(A) = 0;25 wie groß ist dann die Wahrscheinlichkeit des Komplementärereignisses P?	0,75	Lektion 5
Was ist die Voraussetzung um Laplace-Wahrscheinlichkeiten berechnen zu können?	Die Ergebnismenge muss bekannt; endlich sein und jedes Ergebnis muss gleich wahrscheinlich sein.	Lektion 5
Welchen Vorteil bieten vorgefertigte Verteilungsmodelle in der Statistik?	Sie ermöglichen eine schnellere Bestimmung von Wahrscheinlichkeitsfunktionen, Erwartungswerten und Varianzen.	Lektion 6
Auf welcher Art von Zufallsvariablen basieren diskrete Verteilungsmodelle?	Auf diskreten Zufallsvariablen, die nur wenige verschiedene Ausprägungen annehmen können.	Lektion 6
Wie wird ein einzelner Zufallsvorgang bezeichnet, bei dem nur Erfolg oder Misserfolg interessiert?	Bernoullivorgang.	Lektion 6
Was entsteht, wenn mehrere unabhängige Bernoullivorgänge nacheinander durchgeführt werden?	Ein Bernoulliprozess.	Lektion 6
Welche Bedingung muss für die Erfolgswahrscheinlichkeit \(p\) in einem Bernoulliprozess gelten?	Sie muss bei jedem Bernoullivorgang konstant bleiben.	Lektion 6
Wie lautet die erste zentrale Annahme eines Bernoulliprozesses bezüglich der einzelnen Vorgänge?	Die Bernoullivorgänge sind unabhängig voneinander.	Lektion 6
Was beschreibt eine binomialverteilte Zufallsvariable \(X\)?	Die Anzahl der Erfolge in einem Bernoulliprozess mit \(n\) Versuchen.	Lektion 6
Welche zwei Parameter definieren eine Binomialverteilung vollständig?	Der Stichprobenumfang \(n\) und die Erfolgswahrscheinlichkeit \(p\).	Lektion 6
Wie lautet die Formel für die Wahrscheinlichkeitsfunktion der Binomialverteilung \(P(X = k)\)?	\(P(X = k) = \binom{n}{k} \cdot p^k \cdot (1 - p)^{n - k}\).	Lektion 6
Was berechnet der Term \(\binom{n}{k}\) in der Formel der Binomialverteilung?	Die Anzahl der Möglichkeiten, \(k\) Erfolge auf \(n\) Versuche zu verteilen.	Lektion 6
Wie wird der Erwartungswert \(E(X)\) einer binomialverteilten Zufallsvariable berechnet?	\(E(X) = n \cdot p\).	Lektion 6
Formel: Varianz \(Var(X)\) einer Binomialverteilung.	\(Var(X) = n \cdot p \cdot (1 - p)\).	Lektion 6
Wie erhält man die Standardabweichung \(\sigma\) aus der Varianz einer binomialverteilten Zufallsvariable?	Durch das Ziehen der Quadratwurzel aus der Varianz (\(\sigma = \sqrt{Var(X)}\)).	Lektion 6
Warum ist das Erraten von Single-Choice-Antworten (eine von vier richtig) ein Bernoulliprozess?	Weil jeder Rateversuch unabhängig ist und die Erfolgswahrscheinlichkeit (\(p = 0,25\)) gleich bleibt.	Lektion 6
Was zählt eine geometrisch verteilte Zufallsvariable \(X\) im Kontext eines Bernoulliprozesses?	Die Anzahl der Misserfolge bis zum ersten Erfolg.	Lektion 6
Wie lautet die Wahrscheinlichkeitsfunktion \(P(X = k)\) für eine geometrisch verteilte Zufallsvariable?	\(P(X = k) = (1 - p)^k \cdot p\).	Lektion 6
Wie lautet die Formel für den Erwartungswert \(E(X)\) einer geometrisch verteilten Zufallsvariable?	\(E(X) = \frac{1 - p}{p}\).	Lektion 6
Formel: Varianz \(Var(X)\) der geometrischen Verteilung.	\(Var(X) = \frac{1 - p}{p^2}\).	Lektion 6
Was bedeutet ein Erwartungswert von \(E(X) = 3\) bei einer geometrischen Verteilung in einer Prüfung?	Man erwartet drei falsche Antworten, bevor die erste richtige Antwort erfolgt.	Lektion 6
Inwiefern unterscheidet sich die Fragestellung der geometrischen Verteilung von der der Binomialverteilung?	Die geometrische Verteilung fragt nach der Wartezeit (Misserfolge), die Binomialverteilung nach der Anzahl der Erfolge bei fixer Versuchsanzahl.	Lektion 6
Welche Form nimmt die Dichtefunktion einer normalverteilten Zufallsvariable an?	Die Form einer Glockenkurve.	Lektion 6
Welcher Parameter bestimmt die Lage (das Zentrum) einer Normalverteilung?	Der Erwartungswert \(\mu\).	Lektion 6
Welcher Parameter bestimmt die Breite bzw. Streuung einer Normalverteilung?	Die Varianz \(\sigma^2\) (bzw. die Standardabweichung \(\sigma\)).	Lektion 6
Wie wird eine Zufallsvariable \(X\), die normalverteilt mit Mittelwert \(\mu\) und Varianz \(\sigma^2\) ist, symbolisch abgekürzt?	\(X \sim N(\mu, \sigma^2)\).	Lektion 6
Warum ist die Normalverteilung symmetrisch?	Weil sich die Wahrscheinlichkeiten gleichmäßig links und rechts um den Erwartungswert \(\mu\) verteilen.	Lektion 6
Was ist die Standardnormalverteilung?	Eine spezielle Normalverteilung mit dem Erwartungswert \(\mu = 0\) und der Standardabweichung \(\sigma = 1\).	Lektion 6
Zweck: Warum werden normalverteilte Variablen standardisiert?	Um Wahrscheinlichkeiten mithilfe einer standardisierten Tabelle (\(\Phi\)-Tabelle) ablesen zu können.	Lektion 6
Wie lautet die Formel zur Berechnung des \(z\)-Wertes bei der Standardisierung?	\(z = \frac{x - \mu}{\sigma}\).	Lektion 6
Welches Symbol wird für die Verteilungsfunktion der Standardnormalverteilung verwendet?	Der griechische Buchstabe Phi (\(\Phi\)).	Lektion 6
Was gibt der Wert \(\Phi(z)\) inhaltlich an?	Die kumulierte Wahrscheinlichkeit von \(-\infty\) bis zum Wert \(z\).	Lektion 6
Wie berechnet man die Wahrscheinlichkeit für einen Wert oberhalb von \(x\), also \(P(X > x)\), bei der Normalverteilung?	\(P(X > x) = 1 - \Phi(\frac{x - \mu}{\sigma})\).	Lektion 6
Wie geht man vor, wenn bei der Standardisierung ein negativer \(z\)-Wert (z. B. \(-0,5\)) resultiert?	Man nutzt die Symmetrie: \(\Phi(-z) = 1 - \Phi(z)\).	Lektion 6
Wie berechnet man die Wahrscheinlichkeit für ein Intervall \(P(a \le X \le b)\) bei einer Normalverteilung?	\(P(a \le X \le b) = \Phi(\frac{b - \mu}{\sigma}) - \Phi(\frac{a - \mu}{\sigma})\).	Lektion 6
Was beschreibt ein Quantil \(x_p\) der Normalverteilung?	Den Wert, der mit einer Wahrscheinlichkeit von \(p\) nicht überschritten wird.	Lektion 6
Wie lautet die Formel zur Berechnung eines Quantils \(x_p\) aus den Parametern \(\mu\), \(\sigma\) und dem Standardquantil \(z_p\)?	\(x_p = \mu + z_p \cdot \sigma\).	Lektion 6
Welchen Wert hat das Quantil \(z_{0,5}\) in der Standardnormalverteilung?	0 (da die Verteilung symmetrisch um 0 ist).	Lektion 6
Wie bestimmt man ein Quantil \(x_p\), wenn \(p\) kleiner als \(0,5\) ist (z. B. \(x_{0,1}\))?	Man nutzt das negative \(z\)-Quantil der Gegenseite: \(x_p = \mu - z_{1 - p} \cdot \sigma\).	Lektion 6
Was ist ein zentrales Schwankungsintervall?	Ein Intervall, das symmetrisch um den Erwartungswert liegt und eine bestimmte Wahrscheinlichkeitsmasse umschließt.	Lektion 6
Welche Quantile werden benötigt, um ein zentrales Schwankungsintervall für \(90 \%\) Wahrscheinlichkeit zu berechnen?	Das \(5 \, \%\)-Quantil (\(x_{0,05}\)) und das \(95 \, \%\)-Quantil (\(x_{0,95}\)).	Lektion 6
Wie hängen die \(z\)-Werte der Unter- und Obergrenze eines zentralen Schwankungsintervalls zusammen?	Sie sind betragsmäßig gleich, unterscheiden sich aber durch das Vorzeichen (z. B. \(-1,6449\) und \(+1,6449\)).	Lektion 6
Wann wird die \(t\)-Verteilung anstelle der Standardnormalverteilung verwendet?	Wenn die Varianz der Grundgesamtheit unbekannt ist und auf Basis einer Stichprobe geschätzt werden muss.	Lektion 6
Welcher zusätzliche Parameter wird für das Ablesen von Werten aus der \(t\)-Verteilung benötigt?	Die Anzahl der Freiheitsgrade (meist \(n - 1\)).	Lektion 6
Wie verändert sich die Form der \(t\)-Verteilung bei steigender Anzahl an Freiheitsgraden?	Sie nähert sich immer stärker der Standardnormalverteilung an.	Lektion 6
Welche Verteilung wird bei stetigen Variablen wie Fahrzeit oder Körpergröße oft als Modell herangezogen?	Die Normalverteilung.	Lektion 6
Was ist die Gesamtwahrscheinlichkeit (Fläche) unter der Dichtefunktion einer beliebigen stetigen Verteilung?	1 (bzw. \(100 \, \%\)).	Lektion 6
Warum ist die Wahrscheinlichkeit für einen exakten Punkt bei einer stetigen Zufallsvariable nahezu Null?	Weil bei unendlich vielen möglichen Werten die Fläche über einem einzelnen Punkt keine Ausdehnung hat.	Lektion 6
Was ist der Unterschied zwischen der Varianz \(\sigma^2\) und der Standardabweichung \(\sigma\) in Rechenaufgaben zur Normalverteilung?	In der Notation \(N(\mu, \sigma^2)\) steht die Varianz; für die Standardisierung und Quantilberechnung wird jedoch \(\sigma\) benötigt.	Lektion 6
Cloze: Eine binomialverteilte Variable zählt Erfolge bei einer _____ Anzahl an Versuchen.	festgelegten	Lektion 6
Cloze: Die geometrische Verteilung hat im Gegensatz zur Binomialverteilung theoretisch _____ viele Ausprägungen.	unendlich	Lektion 6
Term: Bernoullivorgang	Definition: Ein Zufallsexperiment mit genau zwei möglichen Ausgängen (Erfolg/Misserfolg).	Lektion 6
"Was bedeutet es, wenn ein Ereignis als 'Erfolg' in einem Bernoulliprozess definiert wird?"	Es ist lediglich das Ereignis, für das man sich in der Untersuchung speziell interessiert.	Lektion 6
Wie berechnet man die Wahrscheinlichkeit \(P(X \le k)\) bei einer diskreten Binomialverteilung ohne Verteilungsfunktionstabelle?	Durch Aufsummieren der Einzelwahrscheinlichkeiten von \(P(X = 0)\) bis \(P(X = k)\).	Lektion 6
Welches Quantil \(z_p\) der Standardnormalverteilung entspricht einer kumulierten Wahrscheinlichkeit von \(97,5 \, \%\)?	\(1,96\).	Lektion 6
Welches Quantil \(z_p\) der Standardnormalverteilung gehört zu einer kumulierten Wahrscheinlichkeit von \(95 \, \%\)?	\(1,6449\).	Lektion 6
Was ist die Konsequenz der Symmetrie der Normalverteilung für den Mittelwert, Median und Modus?	Sie fallen bei der Normalverteilung alle auf denselben Wert (\(\mu\)).	Lektion 6
Wie berechnet man die Wahrscheinlichkeit \(P(X \le 42)\) für \(X \sim N(40, 4)\)?	\(\Phi(\frac{42 - 40}{\sqrt{4}}) = \Phi(1) = 0,8413\).	Lektion 6
Wenn \(P(X \le x) = 0,95\), wie nennt man den Wert \(x\)?	Das \(95 \, \%\)-Quantil (oder \(0,95\)-Quantil).	Lektion 6
Was passiert mit der Breite eines zentralen Schwankungsintervalls, wenn das Vertrauensniveau von \(90 \, \%\) auf \(95 \, \ \%\) steigt?	Das Intervall wird breiter.	Lektion 6
Warum benötigt man bei der geometrischen Verteilung die Information über die Unabhängigkeit der Versuche?	Damit die Erfolgswahrscheinlichkeit \(p\) nach jedem Misserfolg unverändert bleibt.	Lektion 6
Wie lautet die Standardabweichung einer geometrisch verteilten Variable mit \(p = 0,25\)?	\(\sqrt{12} \approx 3,46\) (da \(Var(X) = \frac{0,75}{0,25^2} = 12\)).	Lektion 6
Was stellt die \(y\)-Achse im Diagramm einer Dichtefunktion dar?	Die Dichte \(f(x)\) (nicht direkt die Wahrscheinlichkeit).	Lektion 6
Wie wird die Wahrscheinlichkeit in einem Dichtediagramm grafisch dargestellt?	Als Fläche unter der Kurve innerhalb eines Intervalls.	Lektion 6
Warum kann eine Normalverteilung theoretisch Werte von \(-\infty\) bis \(+\infty\) annehmen?	Weil die Dichtefunktion die x-Achse zwar asymptotisch berührt, aber nie ganz erreicht.	Lektion 6
Was ist der Hauptunterschied zwischen der Wahrscheinlichkeitsfunktion (diskret) und der Dichtefunktion (stetig)?	Die Wahrscheinlichkeitsfunktion gibt Punktwahrscheinlichkeiten an, die Dichtefunktion dient der Flächenberechnung für Intervalle.	Lektion 6
Welche Verteilung ist die Basis für den Schätzer des Erwartungswerts bei kleinen Stichproben und unbekannter Varianz?	Die \(t\)-Verteilung.	Lektion 6
Wie lautet der Erwartungswert einer binomialverteilten Variable bei \(n = 10\) und \(p = 0,25\)?	\(2,5\).	Lektion 6
"Was bedeutet 'konsistente Erfolgswahrscheinlichkeit' in einem Bernoulliprozess?"	Dass die Chance auf einen Erfolg bei jeder Wiederholung des Experiments genau gleich groß ist.	Lektion 6
Wie berechnet man das \(0,90\)-Quantil der Standardnormalverteilung?	Man schlägt in der Tabelle den \(z\)-Wert für \(p = 0,90\) nach (\(1,2816\)).	Lektion 6
Berechnung: \(\Phi(0,5)\) laut Tabelle.	\(0,6915\).	Lektion 6
Wie lautet die Wahrscheinlichkeit \(P(X = 0)\) bei einer geometrischen Verteilung?	\(p\) (da \(k = 0\) Misserfolge vor dem ersten Erfolg bedeutet).	Lektion 6
Was ist der maximale Wert, den eine Wahrscheinlichkeitsdichte \(f(x)\) annehmen kann?	Sie kann Werte größer als 1 annehmen (nur die Fläche darunter ist auf 1 begrenzt).	Lektion 6
Warum ist die Standardisierung für jede Normalverteilung \(N(\mu, \sigma^2)\) möglich?	Weil jede Normalverteilung durch lineare Transformation in die Standardnormalverteilung überführt werden kann.	Lektion 6
Wie findet man den \(z\)-Wert zu einer gegebenen Wahrscheinlichkeit in der \(\Phi\)-Tabelle?	Man sucht die Wahrscheinlichkeit im Inneren der Tabelle und liest den zugehörigen Randwert (\(z\)) ab.	Lektion 6
In welchem Fall ist \(P(X = x) > 0\) für einen einzelnen Wert \(x\)?	Nur bei diskreten Zufallsvariablen.	Lektion 6
Welche Parameter hat die \(t\)-Verteilung?	Sie wird primär durch die Anzahl der Freiheitsgrade charakterisiert.	Lektion 6
"Wie drückt man 'mindestens \(x\)' formal für eine Normalverteilung aus?"	\(P(X \ge x) = 1 - P(X < x) = 1 - \Phi(\frac{x - \mu}{\sigma})\).	Lektion 6
Formel: Untergrenze eines zentralen Schwankungsintervalls \(x_{unt}\).	\(x_{unt} = \mu - z_{1 - \frac{\alpha}{2}} \cdot \sigma\).	Lektion 6`;


const parseFlashcards = (tsv, idPrefix = 'c') => {
  const cards = [];
  const lines = tsv.split('\n');

  lines.forEach((line, index) => {
    if (!line.trim() || line.startsWith('#')) return;

    const parts = line.split('\t');
    let q = parts[0] || '';
    let a = parts[1] || '';

    // Clean up quotes from Anki export format
    if (q.startsWith('"') && q.endsWith('"')) q = q.slice(1, -1).replace(/""/g, '"');
    if (a.startsWith('"') && a.endsWith('"')) a = a.slice(1, -1).replace(/""/g, '"');

    // Replace image tags with a stylized placeholder
    const imgPlaceholder = '<span class="inline-block mt-2 text-sky-300 text-xs italic bg-sky-500/20 px-2 py-1 rounded shadow-inner">[Grafik/Formel aus Anki entfernt]</span>';
    q = q.replace(/<img[^>]*>/g, imgPlaceholder);
    a = a.replace(/<img[^>]*>/g, imgPlaceholder);

    // Use 3rd column as topic if provided, otherwise auto-categorize
    let topic = (parts[2] || '').trim();
    let hintType = 'normal';
    const combined = (q + ' ' + a).toLowerCase();

    // Auto-assign hintType based on content (for visual hint graphic)
    if (combined.includes('stichprobe') || combined.includes('grundgesamtheit') || combined.includes('erhebung')) {
      hintType = 'sampling';
    } else if (combined.includes('skala') || combined.includes('diskret') || combined.includes('stetig')) {
      hintType = 'scale';
    } else if (combined.includes('häufigkeit') || combined.includes('median') || combined.includes('mittelwert') || combined.includes('varianz') || combined.includes('streuung') || combined.includes('quantil')) {
      hintType = 'descriptive';
    } else if (combined.includes('kontingenz') || combined.includes('chi-quadrat')) {
      hintType = 'contingency';
    } else if (combined.includes('regression') || combined.includes('korrelation') || combined.includes('bestimmtheitsmaß') || combined.includes('residuum')) {
      hintType = 'linear';
    } else if (combined.includes('wahrscheinlichkeit') || combined.includes('ereignis') || combined.includes('venn') || combined.includes('laplace') || combined.includes('zufallsvariable')) {
      hintType = 'probability';
    } else if (combined.includes('verteilung') || combined.includes('binomial') || combined.includes('normalverteilung') || combined.includes('t-verteilung') || combined.includes('standardisierung')) {
      hintType = 'normal';
    } else if (combined.includes('p-wert') || combined.includes('hypothese') || combined.includes('konfidenzintervall') || combined.includes('schätzer')) {
      hintType = 'pvalue';
    }

    // Fallback topic if 3rd column was empty
    if (!topic) {
      topic = 'Grundlagen';
      if (hintType === 'sampling') topic = 'Datenerhebung';
      else if (hintType === 'scale') topic = 'Skalenniveaus';
      else if (hintType === 'descriptive') topic = 'Deskriptive Statistik';
      else if (hintType === 'contingency') topic = 'Kontingenzanalyse';
      else if (hintType === 'linear') topic = 'Regression & Korrelation';
      else if (hintType === 'probability') topic = 'Wahrscheinlichkeit';
      else if (hintType === 'normal') topic = 'Verteilungen';
      else if (hintType === 'pvalue') topic = 'Inferenzstatistik';
    }

    cards.push({
      id: idPrefix + index,
      topic,
      question: q,
      answer: a,
      hintType,
      state: 'new',
      step: 0,
      interval: 0,
      efactor: 2.5,
      nextReviewDate: Date.now(),
      history: []
    });
  });
  return cards;
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const INITIAL_CARDS = shuffleArray(parseFlashcards(RAW_FLASHCARDS_TSV, 'c'));
const PREISPOLITIK_CARDS = shuffleArray(parseFlashcards(RAW_PREISPOLITIK_TSV, 'pp'));

const INITIAL_DECKS = [
  {
    id: 'deck-statistik-1',
    name: 'Statistik',
    cards: INITIAL_CARDS,
    createdAt: Date.now()
  },
  {
    id: 'deck-preispolitik-1',
    name: 'Preispolitik',
    cards: PREISPOLITIK_CARDS,
    createdAt: Date.now()
  }
];

export const BUNDLED_DECK_ID = 'deck-statistik-1';
export const BUNDLED_DECK_ID_PREISPOLITIK = 'deck-preispolitik-1';

export const DEFAULT_STATS = {
  xp: 0, level: 1, streak: 0, lastStudyDate: null,
  dailyCardsLearned: 0, dailyGoal: 20, achievements: [],
  perfectAnswersStreak: 0, totalCardsLearned: 0,
  totalEasy: 0, totalGood: 0, totalHard: 0, totalAgain: 0,
  activityLog: {}, longestStreak: 0, examHistory: [], deckStats: {}
};

export { RAW_FLASHCARDS_TSV, RAW_PREISPOLITIK_TSV, parseFlashcards, shuffleArray, INITIAL_CARDS, PREISPOLITIK_CARDS, INITIAL_DECKS };
