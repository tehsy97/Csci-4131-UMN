#!/usr/bin/env python3
# See https://docs.python.org/3.2/library/socket.html
# for a decscription of python socket and its parameters
#
# Copyright 2019, Shaden Smith, Koorosh Vaziri,
# Niranjan Tulajapure, Ambuj Nayab,
# Akash Kulkarni, Ruofeng Liu and Daniel J. Challou
# for use by students enrolled in Csci 4131 at the University of
# Minnesota-Twin Cities only. Do not reuse or redistribute further
# without the express written consent of the authors.
#
import socket
#add the following
import socket
import os
import stat
import sys
import codecs
import datetime
from threading import Thread
from argparse import ArgumentParser
from urllib.parse import unquote

BUFSIZE = 4096

#add the following
CRLF = '\r\n'
METHOD_NOT_ALLOWED = 'HTTP/1.1 405 METHOD NOT ALLOWED{}Allow: GET, HEAD, POST {}Connection: close{}{}'.format(CRLF, CRLF, CRLF, CRLF)
REQUEST_NOT_ACCEPTABLE = 'HTTP/1.1 404 NOT ACCEPTABLE{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)
OK = 'HTTP/1.1 200 OK{}{}'.format(CRLF, CRLF)
NOT_FOUND = 'HTTP/1.1 404 NOT FOUND{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)
FORBIDDEN = 'HTTP/1.1 403 FORBIDDEN{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)
MOVED_PERMANENTLY = 'HTTP/1.1 301 MOVED PERMANENTLY{}Location: https://www.youtube.com/{}Connection: close{}{}{}'.format(CRLF, CRLF, CRLF, CRLF, CRLF)

def get_contents(fname):
    with open(fname, 'r') as f:
        return f.read()

def check_perms(resource):
    # Returns True if resource has read permissions set on others"""
    stmode = os.stat(resource).st_mode
    return (getattr(stat, 'S_IROTH') & stmode) > 0

def client_talk(client_sock, client_addr):
    print('talking to {}'.format(client_addr))
    data = client_sock.recv(BUFSIZE)
    while data:
        print(data.decode('utf-8'))
        data = client_sock.recv(BUFSIZE)

    # clean up
    client_sock.shutdown(1)
    client_sock.close()
    print('connection closed.')

class HTTP_HeadServer: #A re-worked version of EchoServer
    def __init__(self, host, port):
        print('listening on port {}'.format(port))
        self.host = host
        self.port = port

        self.setup_socket()

        self.accept()

        self.sock.shutdown()
        self.sock.close()

    def setup_socket(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.bind((self.host, self.port))
        self.sock.listen(128)

    def accept(self):
        while True:
            (client, address) = self.sock.accept()
            #th = Thread(target=client_talk, args=(client, address))
            th = Thread(target=self.accept_request, args=(client, address))
            th.start()

    # here, we add a function belonging to the class to accept
    # and process a request
    def accept_request(self, client_sock, client_addr):
        print("accept request")
        data = client_sock.recv(BUFSIZE)
        req = data.decode('utf-8') #returns a string
        response=self.process_request(req)
        if isinstance(response, str): #returns a string
            #once we get a response, we chop it into utf encoded bytes
            #and send it (like EchoClient)
            print(bytes(response,'utf-8'))############
            #print("\n")
            client_sock.send(bytes(response,'utf-8'))
        else: #return value is not string
            print(response)#################
            #print("\n")############
            client_sock.send(response)
        #clean up the connection to the client
        #but leave the server socket for recieving requests open
        client_sock.shutdown(1)
        client_sock.close()

    # added method to process requests, only head is handled in this code
    def process_request(self, request):
        print('######\nREQUEST:\n{}######'.format(request))
        linelist = request.strip().split(CRLF)
        reqline = linelist[0]
        # postlist = linelist[len(linelist) - 1] 
        # print("this is postline \n")
        # print(postlist)
        rlwords = reqline.split()
        if len(rlwords) == 0:
            return ''
        if rlwords[0] == 'HEAD':
            resource = rlwords[1][1:] # skip beginning /
            return self.head_request(resource)
        elif rlwords[0] == 'GET': #add ELIF checks for GET and POST before this else..
            resource = rlwords[1][1:] # skip beginning /
            return self.get_request(resource)
        elif rlwords[0] == 'POST':
            resource = linelist[-1][0:] # skip beginning /
            return self.post_form(resource)
        elif rlwords[0] != 'HEAD' & rlwords[0] != 'GET' & rlwords[0] != 'POST':
            return METHOD_NOT_ALLOWED
        else:
            return REQUEST_NOT_ACCEPTABLE


    def post_form(self, resource):
        postline = unquote(resource, encoding='utf-8', errors='replace')
        postline = postline.split('&')
        usrInput = [] # to store user inputs
        formquestions = []
        for temp in postline:   #filter out inputs
            temp = temp.split('=')
            formquestions.append(temp[0])
            usrInput.append(temp[1])
        sendForm = OK +  (
            "<html>\n" + 
                "<head>\n" + 
                    "<link rel=" + " \" " + "stylesheet" + " \" " + 
                        " type=" + " \" " + "text/css" + " \" " + 
                            " href=" + " \" " + "style.css" + " \" " + " />" +
                    "<title>Submit</title>\n" + 
                "</head>\n" +
                
                "<body>\n" +
                    "<h1>Following Form Data Submitted Successfully:</h1>\n" +
                    "<table>\n" 
                        "<tr>" +
                        "<th>" + formquestions[0] + "</th>" +
                        "<td>" + usrInput[0] + "</td>\n" + "</tr>" +
                        "<tr>" +
                        "<th>" + formquestions[1] + "</th>" +
                        "<td>" + usrInput[1] + "</td>\n" + "</tr>" +
                        "<tr>" +
                        "<th>" + formquestions[2] + "</th>" +
                        "<td>" + usrInput[2] + "</td>\n" + "</tr>" +
                        "<tr>" +
                        "<th>" + formquestions[3] + "</th>" +
                        "<td>" + usrInput[3] + "</td>\n" + "</tr>" +
                        "<tr>" +
                        "<th>" + formquestions[4] + "</th>" +
                        "<td>" + usrInput[4] + "</td>\n" + "</tr>" +
                        "<tr>" +
                        "<th>" + formquestions[5] + "</th>" +
                        "<td>" + usrInput[5] + "</td>\n" + "</tr>" +
                    "</table>\n" +
                "</body>\n" +
            "</html>")
        return sendForm



    def head_request(self, resource):
        """Handles HEAD requests."""
        if resource == 'mytube':
            return OK
        path = os.path.join('.', resource) #look in directory where server is running
        print(path)
        if not os.path.exists(resource):
            ret = NOT_FOUND
        elif not check_perms(resource):
            ret = FORBIDDEN
        elif resource == 'private.html':
            ret = FORBIDDEN
        else:
            ret = OK
        return ret

    #to do a get request, read resource contents and append to ret value.
    #(you should check types of accept lines before doing so)
    # You figure out the rest
    def get_request(self, resource):
        """Handles GET requests."""
        if resource == 'mytube':
            return MOVED_PERMANENTLY
        path = os.path.join('.', resource)
        if not os.path.exists(resource):
            ret = NOT_FOUND + str(get_contents("404.html"))
        elif not check_perms(resource):
            ret = FORBIDDEN + str(get_contents("403.html"))
        elif resource == 'private.html':
            ret = FORBIDDEN + str(get_contents("403.html"))
        else:
            file = open(resource, 'rb')
            file = file.read()
            ret = bytes(OK,'utf-8') + file
        return ret



def parse_args():
    parser = ArgumentParser()
    parser.add_argument('--host', type=str, default='localhost',
                  help='specify a host to operate on (default: localhost)')
    parser.add_argument('-p', '--port', type=int, default=9001,
                  help='specify a port to operate on (default: 9001)')
    args = parser.parse_args()
    return (args.host, args.port)


if __name__ == '__main__':
    (host, port) = parse_args()
    HTTP_HeadServer(host, port) #Formerly EchoServer
