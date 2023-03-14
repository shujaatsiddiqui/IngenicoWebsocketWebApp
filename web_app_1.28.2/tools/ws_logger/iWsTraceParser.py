import sys
import json
from decimal import Decimal
from optparse import OptionParser

def parseJsonTraceLine(line, show_source_line, outfile):
	begin = line.index('{')
	prefix_line = line[:begin]
	json_line = line[begin:]
	#print("JSON="+json_line, file=outfile)
	trace_obj = json.loads(json_line, parse_float=Decimal)
	if "event" in trace_obj:
		if len(prefix_line) == 0:
			prefix_line = trace_obj["event"]["resource"]["date"]+" "+trace_obj["event"]["resource"]["time"]+" "
		txt = trace_obj["event"]["resource"]["text"]
		if show_source_line == 0:
			txt = txt[txt.index(' '):]
		print(prefix_line+trace_obj["event"]["resource"]["source"]+":"+txt, file=outfile)
	else:
		print(line, file=outfile)

def onLineRead(line, show_source_line, outfile):
	line = line.strip('\n\r')
	try:
		parseJsonTraceLine(line, show_source_line, outfile)
	except ValueError:
		print(line, file=outfile)
	except Exception as e:
		print(type(e), e, file=outfile)
		print(line, file=outfile)

if __name__ == "__main__":

	parser = OptionParser(usage="usage: %prog [options]", version="%prog 1.0")
	parser.add_option("--in", type='string', action="store", dest="input", help="iWS trace file name. if not present - uses stdin")
	parser.add_option("--out", type='string', action="store", dest="output", help="output file name. if not present - uses stdout")
	parser.add_option("--show_source_line", default=0, type='int', action="store", dest="show_source_line", help="show_source_line (1: on, 0: off (default off))")

	(options, args) = parser.parse_args()

	if options.input is None:
		infile = sys.stdin
	else:
		infile = open(options.input, "r")

	if options.output is None:
		outfile = sys.stdout
	else:
		outfile = open(options.output, "w")

	for line in infile:
		onLineRead(line, options.show_source_line, outfile)
