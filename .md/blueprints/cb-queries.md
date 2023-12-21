select * 
from hdt.azdo.epics 
where 
    ANY r IN relations SATISFIES r.url = 'https://dev.azure.com/Derivco/31fcfce5-c6a2-4173-8ad2-c9535f3f83bd/_apis/wit/workItems/1121846'