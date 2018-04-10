
///////////////////// rm -r * ///////////////

match (n) DETACH DELETE n;

////////////////////////////////////////////

CREATE (:Person {id:"loriotbe", firstname:"Benjamin", lastname:"Loriot"}),(:Person {id:"metaisth", firstname:"Thibault", lastname:"M�tais"}),( :Person {id:"jounelgu", firstname:"Guillaume", lastname:"Jounel"})
WITH 1 as dummy
CREATE (:UV {code:"LO21", fullname:"Programmation et conception orientees objet", type:"TM"}),
(:UV {code:"NF16", fullname:"Algorithmique et structures de donn�es", type:"CS"}),
(:UV {code:"MT09", fullname:"Analyse num�rique", type:"CS"}),
(:UV {code:"SY02", fullname:"M�thodes statistiques pour l'ing�nieur", type:"CS"}),
(:UV {code:"NF17", fullname:"Conception de bases de donn�es", type:"TM"}),
(:UV {code:"MT90", fullname:"Fonctions d'une variable reelle 1", type:"CS"}),
(:UV {code:"MT91", fullname:"Fonctions d'une variable reelle 2", type:"CS"}),
(:UV {code:"NF01", fullname:"Algorithmique et programmation", type:"TM"}),
(:UV {code:"SC11", fullname:"h�orie des sciences cognitives : computation et �naction", type:"TSH"}),
(:UV {code:"TN04", fullname:"R�alisation", type:"TM"}),
(:UV {code:"LA14", fullname:"Civilisation du monde anglophone", type:"TSH"}),
(:UV {code:"LC14", fullname:"Communication scientifique et technique en anglais", type:"TSH"}),
(:UV {code:"SR01", fullname:"Maitrise des syst�mes informatiques", type:"TM"}),
(:UV {code:"MT22", fullname:"Fonctions de plusieurs variables r�elles et applications", type:"CS"}),
(:UV {code:"CM11", fullname:"Chimie g�n�rale"}),
(:UV {code:"RO03", fullname:"Recherche op�rationnelle, optimisation combinatoire", type:"CS"})
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"SY02"})
CREATE (a)-[r:SUIT {codeSemestre:"P2018", GX:"GI02"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"NF16"})
CREATE (a)-[r:SUIT {codeSemestre:"A2017", GX:"GI01"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"MT09"})
CREATE (a)-[r:SUIT {codeSemestre:"A2017", GX:"GI01"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"NF17"})
CREATE (a)-[r:SUIT {codeSemestre:"P2018", GX:"GI02"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"MT90"})
CREATE (a)-[r:SUIT {codeSemestre:"A2015", GX:"TC01"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"MT91"})
CREATE (a)-[r:SUIT {codeSemestre:"A2015", GX:"TC01"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"NF01"})
CREATE (a)-[r:SUIT {codeSemestre:"A2015", GX:"TC01"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"SC11"})
CREATE (a)-[r:SUIT {codeSemestre:"A2016", GX:"TC03"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"TN04"})
CREATE (a)-[r:SUIT {codeSemestre:"A2016", GX:"TC03"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"LA14"})
CREATE (a)-[r:SUIT {codeSemestre:"A2016", GX:"TC03"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"LC14"})
CREATE (a)-[r:SUIT {codeSemestre:"A2017", GX:"GI01"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"SR01"})
CREATE (a)-[r:SUIT {codeSemestre:"A2017", GX:"GI01"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"MT22"})
CREATE (a)-[r:SUIT {codeSemestre:"P2016", GX:"TC02"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"CM11"})
CREATE (a)-[r:SUIT {codeSemestre:"P2016", GX:"TC02"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"LO21"})
CREATE (a)-[r:SUIT {codeSemestre:"P2018", GX:"GI02"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"NF16"})
CREATE (a)-[r:SUIT {codeSemestre:"A2017", GX:"GI01"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"SY02"})
CREATE (a)-[r:SUIT {codeSemestre:"A2017", GX:"GI01"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"NF17"})
CREATE (a)-[r:SUIT {codeSemestre:"P2018", GX:"GI02"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"MT90"})
CREATE (a)-[r:SUIT {codeSemestre:"A2015", GX:"TC01"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"MT91"})
CREATE (a)-[r:SUIT {codeSemestre:"A2015", GX:"TC01"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"NF01"})
CREATE (a)-[r:SUIT {codeSemestre:"A2015", GX:"TC01"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"NF01"})
CREATE (a)-[r:SUIT {codeSemestre:"P2016", GX:"TC02"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"TN04"})
CREATE (a)-[r:SUIT {codeSemestre:"P2016", GX:"TC02"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"LA14"})
CREATE (a)-[r:SUIT {codeSemestre:"A2016", GX:"TC03"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"LC14"})
CREATE (a)-[r:SUIT {codeSemestre:"P2018", GX:"GI02"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"SR01"})
CREATE (a)-[r:SUIT {codeSemestre:"A2017", GX:"GI01"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"MT22"})
CREATE (a)-[r:SUIT {codeSemestre:"P2016", GX:"TC02"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"RO03"})
CREATE (a)-[r:SUIT {codeSemestre:"P2017", GX:"TC04"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"metaisth"}),(b:UV {code:"MT09"})
CREATE (a)-[r:SUIT {codeSemestre:"P2017", GX:"TC04"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"loriotbe"}),(b:UV {code:"RO03"})
CREATE (a)-[r:SUIT {codeSemestre:"P2018", GX:"GI02"}]->(b)
WITH 1 as dummy
MATCH (a:Person {id:"jounelgu"}),(b:UV {code:"RO03"})
CREATE (a)-[r:SUIT {codeSemestre:"P2018", GX:"GI04"}]->(b);