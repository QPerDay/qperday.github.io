%%
%% QPDBooklet.cls — Booklet document class
%%
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{QPDBooklet}[2026/08/12 v0.2 QPD Booklet]

% ----- base class -----
\LoadClass[11pt,a4paper]{report}

% ----- required package -----
\RequirePackage{qpd-common}

% ----- sentinel: tells qpd-bootstrap/qpd-end we are the booklet -----
\def\QPDbooklet{1}

% ----- class options -----
\DeclareOption{answers}{\setbool{qpd@renderanswers}{true}}
\DeclareOption{noanswers}{\setbool{qpd@renderanswers}{false}}
\DeclareOption{draft}{\setbool{qpd@draft}{true}}
\DeclareOption{strict}{\setbool{qpd@strict}{true}}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{report}}
\ProcessOptions\relax

% ----- chapter styling (sparse, book-like) -----
\RequirePackage{titlesec}
\titleformat{\chapter}[display]
  {\normalfont\Huge\bfseries}
  {}
  {0pt}
  {\thispagestyle{empty}}
\titlespacing*{\chapter}{0pt}{3.5cm}{2cm}

% ----- \intro command (preamble-only) -----
\newcommand{\intro}[1]{\def\qpd@introtext{#1}}

% Prose on the Problems TOC page and the Answers TOC page.
\newcommand{\problemsintro}[1]{\def\qpd@problemsintro{#1}}
\newcommand{\answersintro}[1]{\def\qpd@answersintro{#1}}

% ----- setter printing (recursion over comma list) -----
\def\qpd@printsetters#1,{%
  \ifx#1\qpd@stop\else
    #1\par
    \expandafter\qpd@printsetters
  \fi
}
\def\qpd@stop{\qpd@stop}

% ===================================================================
% DOCUMENT BEGIN
% ===================================================================

\AtBeginDocument{%

  % ---- Page 1: Cover ----
  \begin{titlepage}
    \centering
    \vspace*{5cm}

    {\Huge\bfseries \@title\par}

    \vfill
  \end{titlepage}

  % ---- Page 2: Foreword ----
  \qpd@readsetters
  \chapter*{Foreword}
  \ifdefined\qpd@introtext
    \qpd@introtext
  \else
    \par\noindent\emph{(Use \texttt{\string\intro\{...\}} in the preamble to add a foreword.)}%
  \fi

  \medskip
  \ifx\qpd@uniquesetters\@empty\else
    \bigskip
    \begin{flushright}
      \begin{minipage}{0.4\textwidth}
        \raggedleft
        {\large\textit{Problem setters}\par}
        \vspace{0.3em}
        {\scshape
          \expandafter\qpd@printsetters\qpd@uniquesetters,\qpd@stop,%
        }%
      \end{minipage}
    \end{flushright}
  \fi

  % Reset so body rebuilds cleanly.
  \gdef\qpd@uniquesetters{}%

  % ---- Warnings from .aux (previous pass) ----
  \ifx\qpd@warnings\@empty\else
    \newpage
    \begin{flushleft}
      \rule{\textwidth}{0.5pt}
      \vspace{0.5em}
      \textbf{\large Warnings from previous run:}\\[0.5em]
      \footnotesize\qpd@warnings
      \vspace{0.5em}
      \rule{\textwidth}{0.5pt}
    \end{flushleft}
  \fi
}

% ---- Global TOC (fires AFTER .aux is read) ----
\AddToHook{begindocument/end}{%
  \qpd@rebuildmonthdata
  \qpd@printglobaltoc
}

% ===================================================================
% DOCUMENT END
% ===================================================================

\AtEndDocument{%
  \qpd@writeauxwarnings
  \qpd@writesetters
  \ifbool{qpd@renderanswers}{\printanswers}{}%
}

\endinput
