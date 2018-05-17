import json
import sys
from ast import literal_eval as make_tuple

filename = sys.argv[1]

f = open(filename, 'r')

names = ('id_etu', 'uv', 'semestre', 'gx', 'gxdd')
#names = ['id_etu']
#names = ['codeUV', 'categorie', 'nom', 'credits', 'descriptionUV']
print(names)

data = []
data_line = []

for line in f:
    line = line.replace('NULL', 'None')
    line = '[' + line[1:line.__len__()-2] + ']'
    line_dict = {}
    line_tuple = make_tuple(line)
    #print(line)
    #print(line_tuple)
    for x in range(names.__len__()):
        #print(x)
        line_dict[names[x]] = line_tuple[x]
    data_line.append(line_dict)
    if data_line.__len__() == 100:
        data.append(data_line)
        data_line = []
if ( data_line.__len__() != 0 ):
    data.append(data_line)

with open(filename + '.json', 'w') as outfile:
    json.dump(data, outfile)

f.close()
