%%
%% QPDSingle.cls — Single-problem document class (minimal)
%%
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{QPDSingle}[2026/08/12 v0.1 QPD Single Problem]

% ----- base class -----
\LoadClass[11pt,a4paper]{article}

% ----- required package -----
\RequirePackage{qpd-common}

% ----- track whether user explicitly set answers/noanswers -----
\newbool{qpd@answersexplicit}
\setbool{qpd@answersexplicit}{false}

% ----- class options -----
\DeclareOption{answers}{%
  \setbool{qpd@renderanswers}{true}%
  \setbool{qpd@answersexplicit}{true}%
}
\DeclareOption{noanswers}{%
  \setbool{qpd@renderanswers}{false}%
  \setbool{qpd@answersexplicit}{true}%
}
\DeclareOption{answersonly}{%
  \setbool{qpd@answersonly}{true}%
  \setbool{qpd@renderanswers}{true}%
  \setbool{qpd@answersexplicit}{true}%
}
\DeclareOption{draft}{%
  \setbool{qpd@draft}{true}%
}
\DeclareOption{strict}{%
  \setbool{qpd@strict}{true}%
}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions\relax

% ----- defaults: standalone → show answers -----
\ifbool{qpd@answersexplicit}{}{\setbool{qpd@renderanswers}{true}}

% ----- end-of-document hooks -----
\AtEndDocument{%
  \qpd@writeauxwarnings
  \ifbool{qpd@renderanswers}{\printanswers}{}%
}

\endinput
